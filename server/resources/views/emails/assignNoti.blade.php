@component('mail::message', ['username' => $username, 'company' => $company, 'project' => $project, 'url' => $url])

# {{$company}}
# {{$username}}様

お世話になります。<br>
Simple-Point運営でございます。

システム管理者より、{{$project}}の作業依頼が届いております。

案件画面より、必要成果物と目安納品日をご確認頂き、問題なければ作業を開始するようにお願いいたします。

@component('mail::button', ['url' => $url])
案件
@endcomponent

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
