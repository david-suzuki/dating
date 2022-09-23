@component('mail::message', ['username' => $username, 'company' => $company, 'project' => $project, 'url' => $url])

# {{$company}}
# {{$username}}様

お世話になります。<br>
Simple-Point運営でございます。

{{$project}}の作業が完了いたしましたので、案件画面より成果物のダウンロードと検収をよろしくお願いいたします。<br>
成果物に問題がある場合は、案件画面のチャットよりご連絡下さい。

@component('mail::button', ['url' => $url])
案件
@endcomponent

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
