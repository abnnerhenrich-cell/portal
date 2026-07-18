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


## Versão 4
- Avisos podem ser marcados como importantes no painel.
- O aviso importante aparece automaticamente no topo do portal.
- A lista de apps foi substituída por um botão para https://kellymenezes.app.
- O gerador de mensagens foi removido.
- Novo gerador avançado de milhar com quantidade, início, final, filtro de repetição e botão para copiar.
