# 使い方

## 事前準備

詳しい説明はドキュメントを読んでください。

### AWS CDK のインストール

AWS が用意したサンプルを使うため、[CDK をインストール](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/getting_started.html)する必要があります。

また、CDKを使うためには [AWS CLI のインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html) および、[アクセスキーとシークレットの設定](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-authentication-user.html)を設定しておく必要があります。

余談ですが、AWS CLI2 から使えるようになった `aws configure sso` による認証は記事を執筆している時点では、[AWS CDK に未対応のようです](https://github.com/aws/aws-cdk/issues/23520)。
(詳しくは検証してません。誤っている場合はご指摘ください)

### Node.js と Yarn のインストール

Node.js はバージョン \>= 16.x をインストールしてください。
筆者は 18 系を使って検証しています。

Yarn は必須ではありませんが、npmだとパッケージインストールに結構時間がかかるので、導入をお勧めします。
本記事では Yarn を前提に書いています。

## バックエンドのデプロイ

バックエンドに関するファイルは

`cognito-passwordless-next-sample/cdk`

にあります。

これは[AWSによるワークショップ](https://catalog.workshops.aws/cognito-webauthn-passwordless/en-US)のコードをベースにしています。

### 手順

例は Ubuntu で説明しますが、他OSでも概ね同じです。

1. ディレクトリに移動します。

```
$ cd cognito-passwordless-next-sample/cdk
```

2. パッケージをインストールします

```
$ yarn
```

2. .env ファイルを編集します。

```
$ code .env
```

`lib/cdk-stack.ts` で使用するための変数を設定します。

各変数は以下のようになっています。

- `FRONTEND_HOST`, `FRONTEND_URL` : Cognito にアクセスする Origin の ホストネームおよび URL を記述します
	- ローカル環境でデバッグする際は、localhost を指定してください
	- パスキーを設定するには https である必要があるので、出来れば Vercel などのデプロイ先を指定してください
- `EMAIL_FROM_ADDRESS` : マジックリンクを送る際の from のメールアドレスを記述します
	- DNS が適切に設定されていないアドレスからのメールは迷惑メールに入りますので、検証の際は注意してください。詳しい説明は本記事の内容から逸れるので割愛します

3. デプロイします

注意 : 本サンプルは `CdkStackSample` という名前のスタックを使用します。
既に同名のスタックが CloudFormation にあると、上書きされます。

デプロイの準備。
ここで失敗した場合は、[認証が正しくできているか](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_auth)を確認してみてください。

```
$ cdk bootstrap
 ⏳  Bootstrapping environment aws://xxxxx/ap-northeast-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://xxxxx/ap-northeast-1 bootstrapped.
 ```
 
続いて、 デプロイを実行します。
途中、 `Do you wish to deploy these changes (y/n)?` と訊かれるので、リソースを確認してから `y` を押します。

```
$ cdk deploy --method direct
 
   (中略)
   
  ✅  CdkStack

✨  Deployment time: 275.76s

Outputs:
CdkStack.ClientId = xxxxx
CdkStack.Fido2Url = https://xxxxx.execute-api.ap-northeast-1.amazonaws.com/v1/
CdkStack.PasswordlessRestApiPasswordlessEndpointXXXXX = https://xxxxx.execute-api.ap-northeast-1.amazonaws.com/v1/
Stack ARN:
arn:aws:cloudformation:ap-northeast-1:xxx:stack/CdkStack/xxx-xxx

✨  Total time: 278.6s
```

Outputs の箇所に作成したリソースのID等が出力されます。
この値は後で使うので、メモしておいてください。

もし、メモし忘れた場合は、AWS コンソールの CloudFormation -> CdkStackSample -> 出力 から確認することができます。

メモ : もし、スタックを削除する場合は `$ cdk destroy` で作成したリソースを削除できます。

## フロントエンドでの動作確認

フロントエンドに関するファイルは

`cognito-passwordless-next-sample/front`

にあります。

### 手順

1. ライブラリのインストール

```
yarn install
```

2. `.env` の設定

`cognito-passwordless-next-sample/front/.env` に、AWSのライブラリで使用する各種変数を設定します。
これらの値は `cognito-passwordless-next-sample/front/src/app/layout.tsx` で使用しています。

- `NEXT_PUBLIC_AWS_REGION`: AWSのリージョンを書きます。Tokyoであれば、ap-northeasat-1です
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`: CDKのデプロイ時に出力された ClientId を書いてください
- `NEXT_PUBLIC_FIDO2_API_URL`: CDKのデプロイ時に出力された Fido2Url を書いてください

3. 実行する

Vercel 等にデプロイするか、`$ yarn dev` で実行します。

4. メールでのユーザー新規作成

このようなページが開くので、下にある「アカウントを作成」を押して
次の新規登録ページでメールアドレスを入力します。

すると、このようなメールが届きます。
メールに書かれているリンクをクリックすると、ログイン済みの状態になります。

備考 : 送信元メールアドレスのDNSの設定を行っていない場合は、迷惑メールのフォルダーに入っていることがあります


5. パスキーの作成

備考 : この操作はローカルの http 環境ではできません。どこかにデプロイして、https のドメインを取得してから行ってください。

ログイン完了のページに遷移するので、
右上のメニューリンクから「Credentialの作成」をクリックします。

デバイス名を入力して、パスキーを登録します。
例えば、Windows であれば Windows Hello のダイアログが出て、登録されます。

6. パスキーでログイン

右上の「ログアウト」をクリックして、一度ログアウトした後で、「生体認証でログイン」をクリックすると、先ほど登録したパスキーでログインができます。
