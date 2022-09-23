@component('mail::message', ['username' => $username, 'company' => $company, 'url' => $url])

# {{$company}}
# {{$username}}様

お世話になります。<br>
Simple-Point運営でございます。

このたびは、Simple-Pointの会員にご登録頂きまして、誠にありがとうございます。<br>
ログインが可能になりましたので、以下のURLよりよろしくお願いいたします。

@component('mail::button', ['url' => $url])
サイトへ
@endcomponent

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
