@component('mail::message', ['account' => $account, 'project' => $project, 'url' => $url])

# 管理者宛

{{$account}}が、{{$project}}の納品申請を行いました。<br>
適時、納品物の確認を行って下さい。

@component('mail::button', ['url' => $url])
案件
@endcomponent

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
