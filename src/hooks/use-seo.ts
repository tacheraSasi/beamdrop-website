import { useEffect } from "react";

const SITE_NAME = "BeamDrop";
const BASE_URL = "https://docs.beamdrop.cloud";

interface SeoProps {
    title: string;
    description: string;
    path?: string;
}

export function useSeo({ title, description, path }: SeoProps) {
    useEffect(() => {
        const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
        document.title = fullTitle;

        const setMeta = (name: string, content: string, attr = "name") => {
            let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        setMeta("description", description);
        setMeta("og:title", fullTitle, "property");
        setMeta("og:description", description, "property");
        setMeta("twitter:title", fullTitle, "property");
        setMeta("twitter:description", fullTitle, "property");

        if (path) {
            const url = `${BASE_URL}${path}`;
            setMeta("og:url", url, "property");
            setMeta("twitter:url", url, "property");
            let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
            if (!canonical) {
                canonical = document.createElement("link");
                canonical.setAttribute("rel", "canonical");
                document.head.appendChild(canonical);
            }
            canonical.setAttribute("href", url);
        }
    }, [title, description, path]);
}
