# Portal Kelly Menezes JB — Versão 3 funcional

## O que mudou

- atualização automática a cada 60 segundos
- conexão pronta com Firebase/Firestore
- listener em tempo real com `onSnapshot`
- modo demonstração quando o Firebase ainda não está configurado
- área VIP com conteúdos, avisos e downloads
- painel administrativo local para cadastrar conteúdo
- conteúdo salvo no navegador com localStorage
- login VIP demonstrativo
- login administrativo demonstrativo

## Login VIP

- usuário: `vip`
- senha: `1234`

## Login do painel

- usuário: `admin`
- senha: `admin123`

Abra `admin.html` para gerenciar:
- palpites públicos
- conteúdos VIP
- avisos
- downloads

## Para ativar resultados reais

Abra `config.js` e altere:

```js
firebase: {
  enabled: true,
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

A coleção padrão é `resultados`.

O portal tenta interpretar documentos com campos como:
- `loteria`
- `horario`
- `timestamp`
- `premios` ou `resultados`

Cada prêmio pode ter:
- `milhar`
- `numero`
- `bicho`
- `animal`

## Observação importante

O painel administrativo atual salva no navegador. Para vários dispositivos e segurança real, mova esses conteúdos para o Firestore e use Firebase Authentication.
