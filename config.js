window.PORTAL_CONFIG = {
  whatsapp: "5511999999999",

  // Cole aqui as configurações do seu Firebase.
  // Quando preenchidas, o portal passa a escutar a coleção "resultados" em tempo real.
  firebase: {
    enabled: false,
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },

  collections: {
    results: "resultados",
    publicPosts: "public_posts",
    vipPosts: "vip_posts",
    vipNotices: "vip_notices",
    vipFiles: "vip_files"
  },

  refreshIntervalSeconds: 60
};
