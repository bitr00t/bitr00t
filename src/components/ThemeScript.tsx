export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint so the page never appears in the wrong theme and
 * then corrects itself.
 *
 * This is a server component on purpose. React 19 warns when a <script> is
 * rendered inside a client component, because scripts do not execute on the
 * client render path — here the tag is only ever server-rendered, which is
 * exactly what a blocking theme script needs to be.
 */
const script = `(function(){
  var key=${JSON.stringify(THEME_STORAGE_KEY)};
  var mq=window.matchMedia("(prefers-color-scheme: dark)");
  function apply(dark){
    var el=document.documentElement;
    el.classList.toggle("dark",dark);
    el.style.colorScheme=dark?"dark":"light";
  }
  function resolve(){
    var stored=null;
    try{stored=localStorage.getItem(key)}catch(e){}
    return stored==="dark"||(stored!=="light"&&mq.matches);
  }
  apply(resolve());
  // Follow the system while no explicit choice has been made ...
  mq.addEventListener("change",function(){
    var stored=null;
    try{stored=localStorage.getItem(key)}catch(e){}
    if(!stored)apply(mq.matches);
  });
  // ... and keep open tabs in agreement.
  window.addEventListener("storage",function(e){
    if(e.key===key)apply(resolve());
  });
})();`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
