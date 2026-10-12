# docker-intro

Docker の考え方を、**1枚の図が組み上がる形**で学ぶための HTML 教材です。
ブラウザで開くだけで動きます（サーバーやビルドは不要）。

すべての説明に、公式ドキュメントへの出典リンクを付けています。

## 開き方

リポジトリを取得して、`docker_visual/index.html` をブラウザで開いてください。

```
git clone https://github.com/capypara20/docker-intro.git
```

## 中身

| ページ | 内容 |
|---|---|
| [`docker_visual/index.html`](docker_visual/index.html) | **全体像**。左の図は常に1枚。右の文章を読み進める（スクロールする）と、輪郭だけだった図に、ホストOS・Docker Engine・イメージ・コンテナ・ネットワーク・ボリュームが1段階ずつ組み上がります。Windows / Linux コンテナの切り替えつき |
| [`docker_visual/example.html`](docker_visual/example.html) | **実例**。Web アプリ ＋ DB を Docker で動かす例を、Linux コンテナと Windows コンテナに分けて解説 |
| [`docker_visual/details.html`](docker_visual/details.html) | **補足**。VM との違い、Windows / Linux・分離モード、Dockerfile からイメージ、ビルドキャッシュ、bridge の名前解決、ポート公開、ボリュームなどを、1ステップずつ動かして確認できます。比較表と出典一覧つき |

図の中の箱は、クリックすると「何の中にあるか」「何が入っているか」「ほかの関係」「意味」「出典」が出ます。

## 出典と注意

- 説明は、Docker Docs と Microsoft Learn の公式ドキュメントをもとにしています。出典の一覧は [`SOURCES.md`](SOURCES.md) と、各ページの「出典」にあります。
- 公式ページで確認できなかった点は「**公式未確認**」と明記しています。公式ドキュメントの内容は更新されるため、**英語の引用は、原文で確認してください**。
- 実例の一部（IP アドレス、サービス名、環境変数名など）は、説明用の例です。

## 構成

```
docker_visual/
├─ index.html        全体像（スクロールで組み上がる）
├─ example.html      実例：Web アプリ ＋ DB
├─ details.html      補足（1ステップずつ動かして確認）
├─ css/              見た目
└─ js/               動き・用語辞書（terms.js）
docker/dockerimage     解説で使っている Dockerfile の例
SOURCES.md             公式ドキュメントの取得メモ（出典）
```
