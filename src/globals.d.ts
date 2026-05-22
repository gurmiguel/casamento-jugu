import { ComponentType, SVGProps } from 'react'

declare module '*.svg' {
  const component: ComponentType<SVGProps<SVGSVGElement>>

  export default component
}

declare global {
  namespace google {
    interface PickingSession {
      id: string
      pickerUri: string
      pollingConfig: PollingConfig
      expireTime: string
      pickingConfig: PickingConfig
      mediaItemsSet: boolean
    }

    interface PollingConfig {
      pollInterval: string
      timeoutIn: string
    }

    interface MediaItemsResponse {
      mediaItems: PickerMediaItem[]
      nextPageToken?: string
    }

    interface PickerMediaItem {
      id: string
      createTime: string
      type: 'UNSPECIFIED' | 'PHOTO' | 'VIDEO'
      mediaFile: MediaFile
    }

    interface MediaFile {
      baseUrl: string
      mimeType: string
      filename: string
      mediaFileMetadata: MediaFileMetadata
    }

    interface MediaFileMetadata {
      width: string
      height: string
    }
  }

  namespace google.accounts {
    interface CredentialResponse {
      /** base64 encoded JWT */
      credential: string
      select_by: 'auto' | 'user' | 'fedcm' | 'fedcm_auto' | 'user_1tap' | 'user_2tap' | 'itp' | 'itp_confirm' | 'btn' | 'btn_confirm'
      state: string
    }
    interface IdConfiguration {
      /** O ID do cliente do seu aplicativo */
      client_id: string;

      /** O esquema de cores aplicado à solicitação do recurso "Um toque". */
      color_scheme?: 'light' | 'dark' | 'neutral';

      /** Ativa a seleção automática. */
      auto_select?: boolean;

      /**
      * A função JavaScript que processa tokens de ID.
      * O modo de UX do botão popup do Google One Tap e Fazer login com o Google usa esse atributo.
      */
      callback?: (response: CredentialResponse) => void;

      /**
      * O URL do seu endpoint de login.
      * O botão Fazer login com o Google no modo redirect de UX usa esse atributo.
      */
      login_uri?: string;

      /** Cancela a solicitação se o usuário clicar fora dela. */
      cancel_on_tap_outside?: boolean;

      /** O ID do DOM do elemento contêiner do aviso com um toque. */
      prompt_parent_id?: string;

      /** Uma string aleatória para tokens de ID */
      nonce?: string;

      /** O título e as palavras no aviso do login com um toque */
      context?: 'signin' | 'signup' | 'use';

      /**
      * Se você precisar chamar o One Tap no domínio principal e nos subdomínios dele,
      * transmita o domínio principal para esse campo para que um único cookie compartilhado seja usado.
      */
      state_cookie_domain?: string;

      /** O fluxo de UX do botão "Fazer login com o Google" */
      ux_mode?: 'popup' | 'redirect';

      /**
      * As origens que podem incorporar o iframe intermediário.
      * O One Tap é executado no modo de iframe intermediário se este campo estiver presente.
      */
      allowed_parent_origin?: string | string[];

      /** Substitui o comportamento padrão do iframe intermediário quando os usuários fecham manualmente o recurso "Um toque". */
      intermediate_iframe_close_callback?: () => void;

      /** Ativa a UX de um toque atualizada em navegadores ITP. */
      itp_support?: boolean;

      /** Pule a seleção de conta fornecendo uma dica de usuário. */
      login_hint?: string;

      /** Limitar a seleção de contas por domínio. */
      hd?: string;

      /**
      * @deprecated Esse atributo foi descontinuado e será ignorado se usado.
      * Permita que o navegador controle os prompts de login do usuário e medie o fluxo de login entre seu site e o Google.
      */
      use_fedcm_for_prompt?: boolean;

      /** Esse campo determina se a UX do botão FedCM deve ser usada no Chrome (computador M125+ e Android M128+). O padrão é false. */
      use_fedcm_for_button?: boolean;

      /**
      * Indica se a opção seleção automática está ativada para o fluxo de botões da FedCM.
      * Se ativado, os usuários recorrentes com uma sessão ativa do Google farão login automaticamente.
      * O valor padrão é false.
      */
      button_auto_select?: boolean;
    }

    interface RevocationResponse {
      successful: boolean
      error?: string
    }

    interface TokenPayload {
      iss: string
      azp: string
      aud: string
      sub: string
      email: string
      email_verified: boolean
      name: string
      jti: string
      nbf: number
      nonce: string
      picture: string
      given_name: string
      family_name: string
      iat: number
      exp: number
    }

    interface PromptMomentNotification {
      isDisplayMoment(): boolean
      isDisplayed(): boolean
      isNotDisplayed(): boolean
      getNotDisplayedReason(): string
      isSkippedMoment(): boolean
      getSkippedReason(): string
      isDismissedMoment(): boolean
      getDismissedReason(): string
      getMomentType(): 'display' | 'skipped' | 'dismissed'
    }

    interface GsiButtonConfiguration {
      type?: string
      theme?: string
      size?: string
      text?: string
      shape?: string
      logo_alignment?: string
      width?: number
      locale?: string
      click_listener?(): void
      state?: string
    }

    interface TokenResponse {
      access_token: string
      expires_in: number
      hd?: string
      prompt: string
      token_type: string
      scope: string
      state?: string
      error?: string
      error_description?: string
      error_uri?: string
    }

    interface TokenClientConfig {
      client_id: string
      scope: string
      include_granted_scopes?: boolean
      redirect_uri?: string
      callback?: (response: TokenResponse) => void
      state?: string
      enable_granular_consent?: boolean
      enable_serial_consent?: boolean
      login_hint?: string
      hd?: string
      ux_mode?: 'popup' | 'redirect'
      select_account?: boolean
      error_callback?: (error: { type: string }) => void
    }

    interface OverridableTokenClientConfig {
      scope?: string
      include_granted_scopes?: boolean
      prompt?: string
      login_hint?: string
      state?: string
    }

    interface TokenClient {
      requestAccessToken(config?: OverridableTokenClientConfig): void
    }

    const id: {
      initialize(idConfig: IdConfiguration): void
      prompt(callback?: (notification: PromptMomentNotification) => void): void
      setLogLevel(level: string): void
      revoke(loginHint: string, callback: (res: RevocationResponse) => void): void
      renderButton(parent: HTMLElement, options?: GsiButtonConfiguration): void
    }
    const oauth2: {
      CodeClient(): unknown
      GoogleIdentityServicesError: Error
      TokenClient: unknown
      hasGrantedAllScopes(scopes: string): unknown
      hasGrantedAnyScopes(scopes: string): unknown
      initCodeClient(): unknown
      initTokenClient(config: TokenClientConfig): TokenClient
      revoke(loginHint: string, callback: (res: RevocationResponse) => void): void
    }
  }
}
