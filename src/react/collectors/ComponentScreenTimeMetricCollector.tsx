"use client";
import { cloneElement, ReactElement } from "react";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import mergeRefs from "../utils/merge-refs";
import { useTelemetry } from "../providers";
import browserCloseHandler from "../utils/browser-close-handler";
import MetricData from "src/core/types/MetricData";

type ComponentScreenTimeMetricCollectorProps = {
  children?: ReactElement;
  counter_options: {
    forcer?: boolean; // Diğerleri ne olursa olsun eğer bu true ise her türlü sayar.
    checkInViewport?: boolean; // Elemanın ekran görünür scroll durumunda olup olmadığını kontrol eder. (Check: IntersectionObserver)
    checkIsDocumentFocused?: boolean; // Elemanın bulunduğu document objesinin focus oluğ olmadığını kontrol eder. (Check: focus, blur events.)
    checkIsVisible?: boolean; // Elemanın bulunduğu document objesinin sekmesinin açık oluğ olmadığını kontrol eder. (Check: Visibility API)
  };
  threshold?: number; // Elemanın görünürlük oranı. (Check: IntersectionObserver),
  tags?: Record<string, string>; // Elemanın tag'leri. (Check: HTMLElement.tagName)
};

// This will need telemetry provider to register Task to TelemetryAS. It will create task for specific purpose.
export function ComponentScreenTimeMetricCollector(
  props: ComponentScreenTimeMetricCollectorProps
) {
  const ref = useRef<HTMLElement | null>(null);

  const telemetry = useTelemetry();
  const [screenTime, setScreenTime] = useState<number>(0);

  const [inViewport, setInViewport] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const [startTime, setStartTime] = useState<number>(0);

  const createMetricData = (data: number): MetricData => {
    return {
      metric_name: "react_component_screen_time",
      tags: {
        component_id: ref.current?.id || "unknown",
        component_tag: ref.current?.tagName || "unknown",
        ...props.tags,
      },
      fields: {
        screen_open_time: data,
      },
    };
  };

  // Handles browser load and unloads.
  useEffect(() => {
    const cleanup: Function = browserCloseHandler(() => {
      if (screenTime === 0) return [];
      setStartTime(0);
      setScreenTime(0);
      return createMetricData(screenTime);
    });
    return () => {
      cleanup();
    };
  }, [screenTime]);

  // Checks the element is in viewport ot not.
  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries[0].isIntersecting) {
            setInViewport(true);
          } else {
            setInViewport(false);
          }
        },
        {
          root: null,
          threshold: props.threshold || 0.9,
        }
      );
      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Checks the document and windows is active or not.
  useEffect(() => {
    const returnFunctions: Function[] = [];
    if (document) {
      const visibilityChangeHandler = () => {
        setIsVisible(document.visibilityState === "visible" ? true : false);
      };

      document.addEventListener("visibilitychange", visibilityChangeHandler);

      returnFunctions.push(() => {
        document.removeEventListener(
          "visibilitychange",
          visibilityChangeHandler
        );
      });
    }

    if (window) {
      const focusChangeHandler = (ev: FocusEvent) => {
        setIsFocused(ev.type === "focus" ? true : false);
      };

      window.addEventListener("blur", focusChangeHandler);
      window.addEventListener("focus", focusChangeHandler);

      returnFunctions.push(() => {
        window.removeEventListener("blur", focusChangeHandler);
        window.removeEventListener("focus", focusChangeHandler);
      });
    }

    return () => {
      returnFunctions.forEach((f) => f());
    };
  }, []);

  // Koşulları kontrol eden bir yardımcı fonksiyon
  const shouldCount = () => {
    const { forcer, checkInViewport, checkIsDocumentFocused, checkIsVisible } =
      props.counter_options;

    if (forcer && inViewport) return true; // Eğer forcer true ise tüm koşulları göz ardı et.
    if (checkInViewport && !inViewport) return false;
    if (checkIsDocumentFocused && !isFocused) return false;
    if (checkIsVisible && !isVisible) return false;

    return true;
  };

  const publishHandler = (data: number) => {
    telemetry.publish([createMetricData(data)]);
  };

  // Calculating the screen time.
  useEffect(() => {
    if (shouldCount()) {
      if (startTime == 0) {
        //console.log("Sayaç başlatıldı.");
        setStartTime(Date.now()); // Sıfırdan başlatıldı.
      }
    } else {
      if (startTime != 0) {
        const elapsedTime = Date.now() - startTime; // Geçen süreyi hesapla.
        // console.log("Duraklatıldı. Arada Geçen Süre: ", elapsedTime);
        setStartTime(0);
        setScreenTime((prev) => prev + elapsedTime); // Geçen süreyi ekle.

        if (!inViewport) {
          // console.log("Sayaç Durduruldu ve Paylaşıldı");
          // eleman artık görünür değil bu nedenle toplam geçen süreyi paylaşma vakti geldiç
          // console.log("Toplam Geçen Süre: ", screenTime + elapsedTime);

          publishHandler(screenTime + elapsedTime); // Toplam süreyi paylaş.

          setStartTime(0);
          setScreenTime(0);
        }
      }
    }
  }, [inViewport, isFocused, isVisible]);

  return props.children
    ? cloneElement(props.children, {
        ref: mergeRefs(ref, (props.children.props as any).ref),
      } as any) // Type assertion to bypass TypeScript's strict type checking
    : null;
}
