@component('mail::message', ['username' => $username, 'company' => $company, 'phone' => $phone,
'email' => $email,'content' => $content])

# {{$company}}
# {{$username}}
# {{$phone}}
# {{$email}}
# {{$content}}

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
