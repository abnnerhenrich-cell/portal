# Portal Kelly Menezes JB — V6 Mobile PWA

## Principais melhorias

- Interface mobile-first para Android e iPhone.
- Suporte às áreas seguras do iPhone, notch e barra inferior.
- PWA instalável com `manifest.webmanifest`.
- Service worker com cache e tela offline.
- Ícones para tela inicial.
- Navegação inferior com cinco acessos.
- Central de notificações dentro do portal.
- Preferências por tipo de notificação.
- Solicitação de notificações do aparelho.
- Avisos importantes aparecem no topo e na central.
- Resultados do Firestore podem gerar notificação.
- Painel administrativo utilizável pelo smartphone.
- Botões e cards com áreas de toque maiores.
- Inputs com 16px para impedir zoom automático no iPhone.
- Animações de toque e suporte a redução de movimento.

## Instalação

O PWA precisa ser publicado em HTTPS.

### Android / Chrome
Use o botão `Instalar` ou o menu do navegador.

### iPhone / Safari
Abra no Safari, toque em Compartilhar e selecione `Adicionar à Tela de Início`.

## Notificações

A central interna funciona imediatamente.

As notificações do sistema exigem:
- site em HTTPS;
- permissão do usuário;
- service worker ativo.

Para notificações push enviadas mesmo com o portal fechado, conecte um provedor de push, como Firebase Cloud Messaging, ao service worker e ao seu backend.

## Firebase

Preencha `config.js` e altere `firebase.enabled` para `true`.

## Logins demonstrativos

VIP:
- usuário: `vip`
- senha: `1234`

Painel:
- usuário: `admin`
- senha: `admin123`
