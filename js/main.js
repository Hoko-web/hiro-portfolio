/**
 * main.js
 * ----------------------------------------------------------------
 * バニラJSで書いたサイトの挙動。機能ごとに関数分割し、
 * トップの initAll() で一括初期化する。
 * DOMが解放される前提なので、<script> には `defer` を付ける。
 * ----------------------------------------------------------------
 */

(function () {
  "use strict";

  // モーション削減の意向を持つユーザーか（アニメーション系は初期化スキップ）
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ============================================================
  // ハンバーガーメニュー
  // ・aria-expanded の真偽をトグル
  // ・body.is-nav-open でスクロールロック
  // ・Escキーで閉じる／リンククリックでも閉じる
  // ============================================================
  function initNavToggle() {
    const toggle = document.querySelector(".js-nav-toggle");
    if (!toggle) return;

    const setState = (isOpen) => {
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "メニューを閉じる" : "メニューを開く"
      );
      document.body.classList.toggle("is-nav-open", isOpen);
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setState(!isOpen);
    });

    // Escキーで閉じる
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("is-nav-open")) {
        setState(false);
        toggle.focus(); // フォーカスを戻す（アクセシビリティ）
      }
    });

    // ナビ内リンククリックでメニューを閉じる
    document.querySelectorAll(".js-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (document.body.classList.contains("is-nav-open")) {
          setState(false);
        }
      });
    });
  }

  // ============================================================
  // スムーススクロール
  // ・#で始まるリンクを delegate で拾う
  // ・ヘッダーの高さ分オフセットして着地
  // ============================================================
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // 固定ヘッダーの高さを引いた位置を求める
      const header = document.querySelector(".js-header");
      const headerHeight = header ? header.offsetHeight : 0;
      const rect = target.getBoundingClientRect();
      const offsetY = rect.top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  // ============================================================
  // 現在のセクションに応じてナビに aria-current を付与
  // ・IntersectionObserver で各セクションを監視
  // ・画面中央付近に入ったセクションを "現在地" と判定
  // ============================================================
  function initNavCurrent() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".js-nav-link");
    if (!sections.length || !navLinks.length) return;

    const setCurrent = (id) => {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === `#${id}`) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrent(entry.target.id);
          }
        });
      },
      {
        // 画面の中央40%帯に入っているものを現在地とする
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ============================================================
  // スクロール連動のフェードイン
  // ・.js-reveal に .is-visible を付与する
  // ・一度表示したら監視解除（パフォーマンス配慮）
  // ============================================================
  function initScrollReveal() {
    const targets = document.querySelectorAll(".js-reveal");
    if (!targets.length) return;

    // モーション削減時は即座に表示
    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // 少しずつディレイをずらして stagger 効果
            const delay = i * 80;
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, delay);
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  // ============================================================
  // ヘッダーのスクロール圧縮
  // ・一定量スクロールしたらクラスを付けてスタイル変化
  // ・rAF で throttle しパフォーマンス劣化を防ぐ
  // ============================================================
  function initHeaderScroll() {
    const header = document.querySelector(".js-header");
    if (!header) return;

    let ticking = false;
    const threshold = 80;

    const update = () => {
      const scrolled = window.scrollY > threshold;
      header.classList.toggle("is-scrolled", scrolled);
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  // ============================================================
  // コピーライトの年表示を自動更新
  // ============================================================
  function initCopyYear() {
    const el = document.getElementById("copy-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  // ============================================================
  // 初期化
  // ============================================================
  function initAll() {
    initNavToggle();
    initSmoothScroll();
    initNavCurrent();
    initScrollReveal();
    initHeaderScroll();
    initCopyYear();
  }

  // defer 付きで読み込む前提だが、念のためDOMの状態で分岐
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
