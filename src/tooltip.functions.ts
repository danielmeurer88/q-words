
export type EasyTooltipOptions = {
    text?: string;
    htmlContent?: HTMLElement[];
    noDefaultClass?: boolean;
    classes?: string[];
    duration?: number;
    prefix?: string;
    anchorName?: string;
};


export function addEasyTooltip(target: HTMLElement, opt: EasyTooltipOptions) {

    opt.prefix ||= 'easy-';
    opt.anchorName ||= '--easy-anchor-name';

    if (!opt.anchorName.startsWith('--')) {
        opt.anchorName = '--' + opt.anchorName;
    }

    addTooltipStyleToHead(opt.prefix, opt.anchorName);

    const t = document.createElement('div')!;

    const remFn = () => {
        t.remove();
    };

    if (target.nextElementSibling) {
        target.parentElement?.insertBefore(t, target.nextElementSibling);
    } else {
        target.parentElement?.appendChild(t);
    }

    if (opt.duration) {
        setTimeout(() => remFn(), opt.duration);
    }

    if (!opt.noDefaultClass) {
        t.classList.add(opt.prefix + 'tooltip-default-class');
    }
    

    if (opt.classes) {
        t.classList.add(...opt.classes);    
    }

    if (opt.text) {
        t.innerText = opt.text;
    }

    if (opt.htmlContent) {
        t.append(...opt.htmlContent);
    }
    
    target.style.anchorName = opt.anchorName;

    return {
        removeTooltip: remFn,
    };

}

function addTooltipStyleToHead(prefix: string, anchorName: string) {

    const styleId = prefix + 'TooltipStyleId';
    const defaultClass = prefix + 'tooltip-default-class';

    let styleEl = document.head.querySelector('style#' + styleId) as HTMLStyleElement;

    if (styleEl) {
        return;
    }

    const style = `
    
        .${defaultClass} {
            position: fixed;
            position-anchor: ${anchorName};
            
            /* would be position-try: --bottom-right */

            top: calc(anchor(bottom) + 1ch);
            right: calc(anchor(right) + 1ch);
            bottom: unset;
            left: unset;
            /**/
            
            position-try: --bottom-left, --top-left;

            opacity: 1;
            transition-property: opacity;
            transition-duration: 300ms;
            transition-timing-function: ease-in-out;

            @starting-style {
                opacity: 0;
            }

            padding: 1ch 1.5ch;
            border: 2px solid;
            border-radius: 1ch;
            corner-shape: squircle;

            background-color: white;
            color: black;
            border-color: #333;


            @media (prefers-color-scheme: dark) {
                background-color: black;
                color: white;
                border-color: #aaa;
            }

        }

        @position-try --bottom-left {
            top: anchor(bottom);
            right: anchor(left);
            bottom: unset;
            left: unset;
        }

        @position-try --top-left {
            top: unset;
            right: anchor(center);
            bottom: anchor(top);
            left: unset;
        }

    `;

    styleEl = document.createElement('style');
    styleEl.setAttribute('id', styleId);
    styleEl.innerText = style;
    document.head.appendChild(styleEl);

}
