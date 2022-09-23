@component('mail::message', ['username' => $username, 'company' => $company, 'project' => $project, 'url' => $url])

# {{$company}}
# {{$username}}様

お世話になります。<br>
Simple-Point運営でございます。

このたびは、{{$project}}をご発注頂きまして、誠にありがとうございます。<br>
順次作業を開始いたしますので、納品までお待ち頂けると幸いです。

また、発注請書を添付していますので、本メールの添付ファイルか案件画面よりダウンロードをよろしくお願いいたします。

@component('mail::button', ['url' => $url])
案件
@endcomponent

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
