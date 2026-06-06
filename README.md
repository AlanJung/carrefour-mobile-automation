# Carrefour Mobile Automation

Automação de testes mobile para o **native-demo-app** utilizando **WebdriverIO** + **Appium**, com geração de relatórios via **Allure** e pipeline de CI/CD no **GitLab**.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Cenários de Teste](#cenários-de-teste)
- [Executando os Testes](#executando-os-testes)
- [Relatórios](#relatórios)
- [BrowserStack](#browserstack-opcional)
- [CI/CD com GitLab](#cicd-com-gitlab)

---

## Tecnologias

| Ferramenta | Versão | Finalidade |
|---|---|---|
| Node.js | 20+ | Ambiente de execução |
| WebdriverIO | ^9 | Framework de testes |
| Appium | ^2 | Driver para automação mobile |
| Mocha | via WDIO | Runner de testes |
| Chai | ^4 | Biblioteca de asserções |
| Allure Report | ^2 | Geração de relatórios |
| GitLab CI/CD | — | Pipeline de integração contínua |
| BrowserStack | — | Execução em dispositivos reais (opcional) |

---

## Pré-requisitos

Antes de instalar as dependências do projeto, certifique-se de que os itens abaixo estão instalados e configurados:

### 1. Java JDK 17+

Baixe e instale o [Temurin JDK 17](https://adoptium.net).

Após a instalação, configure as variáveis de ambiente:

```powershell
# Windows (PowerShell — execute como Administrador)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.x.x", "Machine")
[System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:JAVA_HOME\bin", "Machine")
```

Verifique:
```bash
java -version
# java version "17.x.x"
```

### 2. Android Studio + Android SDK

1. Baixe e instale o [Android Studio](https://developer.android.com/studio).
2. Abra o **SDK Manager** (`Tools → SDK Manager`) e instale:
   - **Android 14.0 (API 34)** — SDK Platform
   - **Android SDK Build-Tools 34**
   - **Android Emulator**
   - **Android SDK Platform-Tools**
3. Configure as variáveis de ambiente:

```powershell
# Windows (PowerShell — execute como Administrador)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "Machine")
[System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator", "Machine")
```

Verifique:
```bash
adb version
# Android Debug Bridge version x.x.x
```

### 3. Criar Emulador Android (AVD)

Abra o **AVD Manager** (`Tools → Device Manager`) no Android Studio e crie:

- **Nome:** `Pixel_6_API_34`
- **Dispositivo:** Pixel 6
- **System Image:** Android 14.0 (API 34) x86_64

Ou via linha de comando:
```bash
avdmanager create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64" -d pixel_6
```

### 4. Appium

```bash
npm install -g appium
appium driver install uiautomator2
appium driver install xcuitest   # apenas macOS
npm install -g appium-doctor
appium-doctor --android          # todos os checks devem estar verdes
```

### 5. APK do native-demo-app

Baixe o arquivo `app-release.apk` na [página de releases](https://github.com/webdriverio/native-demo-app/releases) e salve em:

```
apps/android/app-release.apk
```

---

## Configuração do Ambiente

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/<seu-usuario>/carrefour-mobile-automation.git
cd carrefour-mobile-automation
npm install
```

---

## Estrutura do Projeto

```
Carrefour-mobile-automation/
├── apps/
│   ├── android/app-release.apk     # APK do native-demo-app
│   └── ios/                        # .app / .ipa (apenas macOS)
├── config/
│   ├── wdio.shared.conf.js         # Configurações base, reporters e hooks
│   ├── wdio.android.conf.js        # Emulador Android local
│   ├── wdio.ios.conf.js            # Simulador iOS (macOS only)
│   ├── wdio.browserstack.android.conf.js
│   └── wdio.browserstack.ios.conf.js
├── data/
│   ├── users.json                  # Dados de login para testes parametrizados
│   └── forms.json                  # Entradas para testes de formulário
├── test/
│   ├── pageobjects/
│   │   ├── base.page.js            # Classe base com métodos reutilizáveis
│   │   ├── login.page.js
│   │   ├── home.page.js
│   │   ├── forms.page.js
│   │   ├── swipe.page.js
│   │   ├── drag.page.js
│   │   └── webview.page.js
│   └── specs/
│       ├── 01.login.spec.js        # Cenários C01–C03
│       ├── 02.forms.spec.js        # Cenários C04–C08
│       ├── 03.navigation.spec.js   # Cenário NAV
│       ├── 04.swipe.spec.js        # Cenários C09–C11
│       └── 05.webview.spec.js      # Cenário C12
├── reports/screenshots/            # Screenshots capturadas em falhas
├── .allure-results/                # Dados brutos do Allure
├── allure-report/                  # Relatório HTML gerado
├── .gitlab-ci.yml
├── .gitignore
├── package.json
└── README.md
```

---

## Cenários de Teste

| ID | Descrição | Arquivo | Tipo |
|---|---|---|---|
| C01 | Login com credenciais válidas (alerta "Success") | 01.login.spec.js | Data-driven |
| C02 | Login inválido — e-mail sem @ e senha curta (erros inline) | 01.login.spec.js | Data-driven |
| C03 | Login com campos vazios — validação inline | 01.login.spec.js | Funcional |
| C04 | Navegação para a tela de Forms | 02.forms.spec.js | Funcional |
| C05 | Preenchimento do campo de texto e verificação do resultado | 02.forms.spec.js | Data-driven |
| C06 | Switch toggle — verificação de mudança de estado | 02.forms.spec.js | Funcional |
| C07 | Dropdown — seleção de opção e verificação | 02.forms.spec.js | Funcional |
| C08 | Botões Active/Inactive — visibilidade e toque | 02.forms.spec.js | Funcional |
| NAV | Navegação entre todas as abas do menu inferior | 03.navigation.spec.js | Funcional |
| C09 | Swipe horizontal — navegação pelos 5 cards do carousel | 04.swipe.spec.js | Funcional |
| C10 | Swipe vertical (scroll down) — encontrar o robô escondido | 04.swipe.spec.js | Funcional |
| C11 | Drag & Drop dos 9 itens para os alvos corretos | 04.swipe.spec.js | Funcional |
| C12 | Abertura de WebView e identificação de contextos | 05.webview.spec.js | Funcional |

> **Total:** 16 testes (incluindo os datasets data-driven), todos executados com sucesso no emulador Android 14.

---

## Executando os Testes

### Android (emulador local)

```bash
# 1. Inicie o emulador (aguarde o boot completo)
emulator -avd Pixel_6_API_34

# 2. Execute os testes
#    O servidor Appium é iniciado automaticamente pelo @wdio/appium-service
npm run test:android
```

> O `@wdio/appium-service` sobe e derruba o Appium automaticamente a cada execução — não é necessário iniciá-lo manualmente.

### iOS (apenas macOS)

```bash
npm run test:ios
```

### BrowserStack

```bash
export BROWSERSTACK_USER=seu_usuario
export BROWSERSTACK_KEY=sua_access_key
export BROWSERSTACK_APP_ID=bs://id_do_app_apos_upload

npm run test:browserstack:android
npm run test:browserstack:ios
```

Para fazer o upload do APK ao BrowserStack:
```bash
curl -u "usuario:access_key" \
  -X POST "https://api-cloud.browserstack.com/app-automate/upload" \
  -F "file=@apps/android/app-release.apk"
# Guarde o "app_url" retornado como BROWSERSTACK_APP_ID
```

---

## Relatórios

Após a execução dos testes, gere e abra o relatório Allure:

```bash
npm run report:generate
npm run report:open
```

O relatório contém:
- Resumo de testes executados (passou / falhou / pendente)
- Screenshots capturadas automaticamente em falhas
- Logs de cada passo de execução
- Informações do ambiente (plataforma, dispositivo, versão do app)

Screenshots de falhas ficam salvas em `reports/screenshots/`.

---

## BrowserStack (opcional)

A integração com BrowserStack permite execução em dispositivos reais.

1. Crie uma conta em [browserstack.com](https://www.browserstack.com).
2. Obtenha suas credenciais em **Account → Settings → Access Keys**.
3. Faça upload do APK conforme descrito acima.
4. Configure as variáveis de ambiente e execute `npm run test:browserstack:android`.

> Contas trial possuem limitação de minutos e dispositivos simultâneos.

---

## CI/CD com GitLab

O arquivo `.gitlab-ci.yml` configura dois stages:

| Stage | Job | Descrição |
|---|---|---|
| `validate` | `validate` | Instala dependências e valida a sintaxe de configs, Page Objects, specs e arquivos de dados JSON |
| `device-tests` | `browserstack-android` | Roda os testes em dispositivos reais via BrowserStack e publica o relatório Allure (opcional — habilitado quando há credenciais) |

### Por que validação em vez de emulador no CI?

Os testes mobile exigem um **emulador Android (com KVM)** ou **simulador iOS (macOS)**. Os **runners compartilhados do GitLab.com não suportam virtualização aninhada (KVM)**, então não conseguem subir o emulador.

Por isso o pipeline executa um **stage de validação** (sempre verde), garantindo a integridade do código a cada push. A execução real dos 16 cenários acontece:

- **Localmente**, em emulador Android: `npm run test:android`
- **Na nuvem**, via BrowserStack: `npm run test:browserstack:android` (job `device-tests`)

> Para rodar os testes de emulador no CI seria necessário um **runner self-hosted com KVM** habilitado.

### Variáveis de ambiente no GitLab

Acesse `Settings → CI/CD → Variables` e adicione (para habilitar o job BrowserStack):

| Variável | Descrição |
|---|---|
| `BROWSERSTACK_USER` | Usuário do BrowserStack |
| `BROWSERSTACK_KEY` | Access Key do BrowserStack |

### Hospedagem

O código é mantido no **GitHub** (repositório principal) e enviado também ao **GitLab**, onde o pipeline CI/CD é executado a cada push.

---

## Autor

Desenvolvido como desafio de automação de testes mobile.
