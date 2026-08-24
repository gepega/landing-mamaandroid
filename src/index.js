export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonicalHost = "tiendasmamaandroid.com";
    const isPreviewHost = url.hostname.endsWith(".workers.dev");

    if (!isPreviewHost && (url.hostname !== canonicalHost || url.protocol !== "https:")) {
      url.protocol = "https:";
      url.hostname = canonicalHost;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
