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

    const redirects = {
      "/digi-aviles/": "/digi-aviles-castrillon-corvera/",
      "/digi-en-aviles/": "/digi-aviles-castrillon-corvera/",
      "/digi/": "/digi-aviles-castrillon-corvera/",
      "/digimobil/": "/digi-aviles-castrillon-corvera/",
      "/tienda-digi-aviles/": "/digi-aviles-castrillon-corvera/",
      "/fibra-digi-aviles/": "/digi-aviles-castrillon-corvera/",
      "/reparacion-moviles/": "/reparacion-moviles-aviles-castrillon-corvera/",
      "/reparacion-moviles-aviles/": "/reparacion-moviles-aviles-castrillon-corvera/",
      "/phone-repair-aviles/": "/reparacion-moviles-aviles-castrillon-corvera/",
      "/screen-replacement-aviles/": "/reparacion-moviles-aviles-castrillon-corvera/",
      "/cambio-pantalla-aviles/": "/reparacion-moviles-aviles-castrillon-corvera/",
      "/cambio-bateria-aviles/": "/reparacion-moviles-aviles-castrillon-corvera/"
    };
    const target = redirects[url.pathname];
    if (target) {
      url.pathname = target;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
