@component('mail::message', ['username' => $username, 'company' => $company, 'url' => $url])

# {{$company}}
# {{$username}}様

お世話になります。<br>
Simple-Point運営でございます。

現在、進行中の案件にて未読のチャットがあります。<br>
お手数おかけしますが、以下のURLよりご確認をお願いいたします。

@component('mail::button', ['url' => $url])
サイトへ
@endcomponent

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
