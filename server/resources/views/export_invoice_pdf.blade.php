<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $data['title'] }}_請求書</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">
    <style type="text/css">
        @font-face {
            font-family: ipag;
            font-style: normal;
            font-weight: normal;
            src: url('{{ storage_path('fonts/migu-1m-regular.ttf') }}') format('truetype');
        }
        @font-face {
            font-family: ipag;
            font-style: bold;
            font-weight: bold;
            src: url('{{ storage_path('fonts/migu-1m-bold.ttf') }}') format('truetype');
        }
        body {
            font-family: ipag !important;
        }
    	th {
    		font-size:120%;
    		font-weight: bold;
    	}
        p {
            margin-bottom: 6px;
        }
        .imageContainer {
           background-image: url("{{$imgdata }}");
           background-size: 100px;
           background-repeat: no-repeat;
           background-position: 100px 0px;
           background-blend-mode: screen;
        }        
    </style>
</head>

<body>
	<div style="text-align:center; font-size:20px;font-weight: bold">請 求 書</div>
	<br />

    <div style="width: 100%; height: auto; margin-top: 20px;">
        <div style="float: left; width: 66%; height: auto; padding-right: 30px;">
            <div style="width: 100%; height: 30px;">
            <div style="float: left; width: 65%; height: 30px; text-align: center; font-weight: bold; border-bottom: 2px solid black; padding-right: 20px; padding-bottom: 5px;font-size: 20px">
                    {{ $data['company'] }}
                </div>
                <div style="width: 30%; float: right; ">御中</div>
            </div>
            <div style="width: 100%; height: 25px; margin-top: 0px">
                <div style="width: 20%; float: left; text-align: right; font-weight: bold">
                    ご担当：
                </div>
                <div style="width: 70%; float: left; text-align: center;">{{ $data['person'] }}</div>
                <div style="width: 35%; float: right; text-align: left;">様</div>
            </div>
            <br />
            <div style="width: 100%; height: 30px; border-bottom: 2px solid black; margin-bottom: 1px;">
                <div style="width: 20%; float: left; text-align: right; font-weight: bold">
                    件名：
                </div>
                <div style="width: 76%; float: right; padding-left: 20px;">{{ $data['name'] }}</div>
            </div>
            <div style="width: 100%; height: 120px; border-top: 2px solid black; text-align: center; padding-top: 0px;">下記のとおり、ご請求申し上げます。
            </div>
            <div style="width: 100%; height: 40px; margin-bottom: 10px;">
                <div style="width: 20%; float: left; text-align: right;">
					お支払期限：
                </div>
                <div style="width: 76%; float: right; height: 30px;border-bottom: 2px solid black">{{ $data['payment_date'] }}</div>
            </div>
            <div style="width: 100%; margin-top: 50px;">
                <div style="width: 35%; text-align: center; font-weight: bold; float: left; font-size: 20px;border-bottom: 2px solid black; margin-bottom: 1px;">
                    合計金額
                </div>
                <div style="width: 85%; text-align: center; font-weight: bold; float: left; font-size: 20px;border-bottom: 2px solid black; margin-bottom: 1px;">
                    ¥{{ number_format($data['amount']) }}
                </div>
                <div style="width: 20%; text-align: center; float: right;">
                    （税込）
                </div>
            </div>
            <!-- <div style="width: 100%; height: 1px; border-top: 2px solid black; border-bottom: 2px solid black; margin-top: 80px;"></div> -->
        </div>
        <div style="float: right; width: 30%; height: auto;">
            <p>請求No.{{ $data['no'] }}</p>
            <p>請求日.{{ $data['created_date'] }}</p>
            <br />
            <div class="imageContainer">
                <p>Apex株式会社</p>
                <p>〒150-0002</p>
                <p>東京都渋谷区渋谷3-6-2</p>
                <p>エクラート渋谷5F</p>
            </div>
            <p>TEL：03-6822-8754</p>
            <p>E-mail： info@apex.tokyo</p>
        </div>
    </div>
    <div style="width: 100%; height: auto; ">
    <table class="table table-bordered" style="margin-top: 500px">
          <colgroup>
            <col style="width: 5%" />
            <col style="width: 55%" />
            <col style="width: 15%" />
            <col style="width: 25%" />
          </colgroup>           
            <thead class="thead-light">
              <tr>
                <th style="text-align: center;">No.</th>
                <th style="text-align: center;">摘要</th>
                <th style="text-align: center;">数量</th>
                <th style="text-align: center;">金額</th>
              </tr>
            </thead>
            <tbody>
				@for ($i = 0; $i < 3; $i++)
				<tr style="font-size: 15px;">
					<td style="text-align: center;padding-top: 0px;padding-bottom: 0px;">{{ $i + 1}}</td>
					<td style="padding-top: 0px;padding-bottom: 0px;">{{ $subdata[$i][0] }}</td>
					<td style="padding-top: 0px;padding-bottom: 0px;">
                        <div style="width: 70%; text-align: center; float: left;">{{ $subdata[$i][1] }} </div>
                        <div style="width: 20%; float: right;">ha </div>
                    </td>
					<!-- <td style="text-align: center;padding-top: 0px;padding-bottom: 0px;">{{ $subdata[$i][1] }} ha</td> -->
					<td style="text-align: right;padding-top: 0px;padding-bottom: 0px;">{{ number_format($subdata[$i][2]) }}</td>
				</tr>
				@endfor
              <tr style="font-size: 15px;">
                <td style="text-align: center;padding-top: 0px;padding-bottom: 0px;">4</td>
				<td style="padding-top: 0px;padding-bottom: 0px;">{{ $subdata[3][0] }}</td>
                <td style="padding-top: 0px;padding-bottom: 0px;">
                    <div style="width: 70%; text-align: center; float: left;">{{ $subdata[3][1] }} </div>
                    <div style="width: 20%; float: right;">本</div>
                </td>
                <!-- <td style="text-align: center;padding-top: 0px;padding-bottom: 0px;">{{ $subdata[3][1] }} 本</td> -->
                <td style="text-align: right;padding-top: 0px;padding-bottom: 0px;">{{ number_format($subdata[3][2]) }}</td>
              </tr>
			  @for ($i = 4; $i < 8; $i++)
				<tr style="font-size: 15px;">
					<td style="text-align: center;padding-top: 0px;padding-bottom: 0px;">{{ $i + 1}}</td>
					<td style="padding-top: 0px;padding-bottom: 0px;">{{ $subdata[$i][0] }}</td>
                    <td style="padding-top: 0px;padding-bottom: 0px;">
                    <div style="width: 70%; text-align: center; float: left;">{{ $subdata[$i][1] }} </div>
                        <div style="width: 20%; float: right;">式</div>
                    </td>
					<!-- <td style="text-align: right;padding-top: 0px;padding-bottom: 0px;">式</td> -->
                    <td style="text-align: right;padding-top: 0px;padding-bottom: 0px;">{{ number_format($subdata[$i][2]) }}</td>
				</tr>
				@endfor
              <tr style="font-size: 15px;">
                <td></td>
                <td></td>
                <td style="text-align: center;padding-top: 0px;padding-bottom: 0px;font-weight: bold">小計</td>
                <td style="text-align: right;padding-top: 0px;padding-bottom: 0px;">¥{{ number_format($data['subamount']) }}</td>
              </tr>
              <tr style="font-size: 15px;">
                <td></td>
                <td></td>
                <td style="text-align: center;padding-top: 0px;padding-bottom: 0px;font-weight: bold">消費税</td>
                <td style="text-align: right;padding-top: 0px;padding-bottom: 0px;">¥{{ number_format($data['tax']) }}</td>
              </tr>
              <tr style="font-size: 15px;">
                <td></td>
                <td></td>
                <td style="text-align: center;padding-top: 0px;padding-bottom: 0px;font-weight: bold">合計</td>
                <td style="text-align: right;padding-top: 0px;padding-bottom: 0px;font-weight: bold">¥{{ number_format($data['amount']) }}</td>
              </tr>
            </tbody>
        </table>
    </div>
</body>

</html>