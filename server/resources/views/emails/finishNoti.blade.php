@component('mail::message', ['username' => $username, 'company' => $company, 'project' => $project, 'url' => $url])

# {{$company}}
# {{$username}}様

お世話になります。<br>
Simple-Point運営でございます。

このたびは、{{$project}}をご発注・ご検収頂きまして、誠にありがとうございました。<br>
本案件は検収が完了しましたので、クローズとなります。

また、請求書を添付していますので、本メールの添付ファイルか案件画面よりダウンロードをよろしくお願いいたします。

@component('mail::button', ['url' => $url])
案件
@endcomponent

またのご利用を心よりお待ちしております。

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
