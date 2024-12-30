import { $, component$, useComputed$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { useContent } from "@builder.io/qwik-city";

import ToggleMenu from "~/components/common/ToggleMenu";
import IconChevronDown from "../icons/IconChevronDown";
import { Logo } from "../common/Logo";
import { ThemeConfig, ThemeFonts, ThemeStyles, ThemeBaseColors, ThemePrimaryColors, ThemeBorderRadiuses } from "@qwik-ui/utils";
import { useTheme } from "~/lib/provider";

import IconMoon from "../icons/IconMoon";
import IconSun from "../icons/IconSun";
import ToggleX from "./ToggleX";




export default component$(() => {

  const { themeSig } = useTheme();
  const { menu } = useContent();


  const store = useStore({
    theme: (typeof window !== "undefined" && window.localStorage.theme) || "light",
    primaryColor: (typeof window !== "undefined" && window.localStorage.primaryColor) || ThemePrimaryColors.CYAN600,
    isScrolling: false,
  });

  // Computed theme configuration based on the stored theme and primaryColor
  const themeComputedObjectSig = useComputed$((): ThemeConfig => {
    if (!store.theme || store.theme === 'light') {
      return {
        font: ThemeFonts.SANS,
        mode: store.theme,
        style: ThemeStyles.SIMPLE,
        baseColor: ThemeBaseColors.SLATE,
        primaryColor: store.primaryColor, // Use the stored primary color
        borderRadius: ThemeBorderRadiuses['BORDER-RADIUS-0'],
      };
    }

    if (store.theme === 'dark') {
      return {
        font: ThemeFonts.SANS,
        mode: store.theme,
        style: ThemeStyles.SIMPLE,
        baseColor: ThemeBaseColors.SLATE,
        primaryColor: store.primaryColor, // Use the stored primary color
        borderRadius: ThemeBorderRadiuses['BORDER-RADIUS-0'],
      };
    }

    // Fallback return in case the theme value is not recognized
    let themeArray: string[] = []; // Default value

    if (themeSig?.value) {
      themeArray = Array.isArray(themeSig.value)
        ? themeSig.value
        : themeSig.value.split(' ');
    }


    return {
      font: themeArray[0],
      mode: themeArray[1],
      style: themeArray[2],
      baseColor: themeArray[3],
      primaryColor: themeArray[4],
      borderRadius: themeArray[5],
    };
  });



  //   // Function to change the primary color and persist it
  //   const changePrimaryColor = $((newColor: string)=>{
  //     store.primaryColor = newColor;
  //     window.localStorage.setItem('primaryColor', newColor); // Save the selected primary color to localStorage
  // });





  useVisibleTask$(() => {
    store.theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';

    const storedPrimaryColor = localStorage.getItem('primaryColor');
    store.primaryColor = storedPrimaryColor || 'defaultColor';
  });







  const themeStoreToThemeClasses$ = $((): string => {
    const { font, mode, style, baseColor, primaryColor, borderRadius } =
      themeComputedObjectSig.value;
    return [font, mode, style, baseColor, primaryColor, borderRadius].join(' ');
  }
  );

  return (
    <header
      id="header"
      class={`sticky top-0 z-40 flex-none mx-auto w-full border-b border-gray-50/0 transition-[opacity] ease-in-out ${store.isScrolling
          ? " md:bg-white/90 md:backdrop-blur-sm dark:md:bg-slate-900/90 bg-white dark:bg-slate-900"
          : ""
        }`}
      window:onScroll$={() => {
        if (!store.isScrolling && window.scrollY >= 10) {
          store.isScrolling = true;
        } else if (store.isScrolling && window.scrollY < 10) {
          store.isScrolling = false;
        }
      }}
    >

      <div class="border-radius-dot-25 rounded-t-2xl rounded-b-sm mt-1.5 mx-1.5 bg-white/90 dark:bg-gray-900/90">

        <div class="relative text-default py-3 sm:py-2 px-3 md:px-6 mx-auto w-full md:flex md:justify-between max-w-7xl">
          <div class="mr-auto rtl:mr-0 rtl:ml-auto flex justify-between">
            <a class="flex items-center" href={"/"}>
              <Logo />



            </a>
            <div class="flex items-center md:hidden">
              <button
                type="button"
                class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center"
                aria-label="Toggle between Dark and Light mode"
                onClick$={async () => {
                  themeComputedObjectSig.value.mode =
                    themeComputedObjectSig.value.mode?.includes('light') ? 'dark' : 'light';
                  themeSig.value = await themeStoreToThemeClasses$();
                }}
              >
                {store.theme == "dark" ? (
                  <IconMoon />
                ) : (
                  <IconSun />
                )}
              </button>
                <ToggleX/>
              <ToggleMenu />
            </div>
          </div>
          <nav
            class="items-center w-full md:w-auto hidden md:flex text-default dark:text-white text-black overflow-y-auto overflow-x-hidden md:overflow-y-visible md:overflow-x-auto md:mx-5"
            aria-label="Main navigation"
          >
            {menu && menu.items ? (
              <ul class="flex flex-col md:flex-row md:self-center w-full md:w-auto text-xl md:text-[0.9375rem] tracking-[0.01rem] font-medium">
                {menu.items.map(({ text, href, items }, key) => (
                  <li key={key} class={items?.length ? "dropdown" : ""}>
                    {items?.length ? (
                      <>
                        <button class="hover:text-link dark:hover:text-white px-4 py-3 flex items-center">
                          {text}{" "}
                          <IconChevronDown class="w-3.5 h-3.5 ml-0.5 rtl:ml-0 rtl:mr-0.5 hidden md:inline" />
                        </button>
                        <ul class="dropdown-menu md:backdrop-blur-md dark:md:bg-slate-800 rounded md:absolute pl-4 md:pl-0 md:hidden font-medium md:bg-white/90 md:min-w-[200px] drop-shadow-xl">
                          {items.map(({ text: text2, href: href2 }, key2) => (
                            <li key={key2}>
                              <a
                                class="first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
                                href={href2}
                              >
                                {text2}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <a
                        class="hover:text-link dark:hover:text-white px-4 py-3 flex items-center"
                        href={href}
                      >
                        {text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </nav>

          <div class="hidden md:self-center md:flex items-center md:mb-0 fixed w-full md:w-auto md:static justify-end left-0 rtl:left-auto rtl:right-0 bottom-0 p-3 md:p-0">
            <div class="items-center flex justify-between w-full md:w-auto">
              <div class="flex">
               {/* <ToggleTheme iconClass="w-6 h-6 md:w-5 md:h-5 md:inline-block" />  */}
                
              </div>
              <span class="ml-4 rtl:ml-0 rtl:mr-4">
                <a
                  href="https://github.com/onwidget/qwind"
                  class="btn btn-primary ml-2 py-2.5 px-5.5 md:px-6 font-semibold shadow-none text-sm w-auto"
                >
                  Download
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
