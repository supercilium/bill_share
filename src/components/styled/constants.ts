export const TRANSITION = "0.2s ease-in-out 100ms"

export const size = {
    mobileM: 375,
    tablet: 768,
    laptop: 1280,
    laptopL: 1440,
    wide: 1600,
    hd: 1920,
}

export const device = {
    mobileM: `(min-width: ${size.mobileM}px)`,
    tablet: `(min-width: ${size.tablet}px)`,
    laptop: `(min-width: ${size.laptop}px)`,
    laptopL: `(min-width: ${size.laptopL}px)`,
    wide: `(min-width: ${size.wide}px)`,
    hd: `(min-width: ${size.hd}px)`,
}
