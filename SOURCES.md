# Docker 公式ドキュメント 取得メモ（HTML解説の素材）

- 取得日：2026-10-12
- 目的：イメージ／ネットワーク／ボリューム／Windows・Linuxコンテナの解説HTML（`docker_visual/index.html`）の出典元
- 注意：取得ツールは「ページを小型モデルで要約して返す」仕組み。
  下の「原文引用」は**ブラウザで原文と照合してから**公開・共有すること。
- HTML 側にも同じ内容を「出典」タブとして載せている

## 全体像（用語の関係）

出典：https://docs.docker.com/get-started/docker-overview/

- Docker daemon（dockerd）：API のリクエストを受け付け、イメージ・コンテナ・ネットワーク・ボリュームを管理
  - 原文："manages Docker objects such as images, containers, networks, and volumes"
- Docker client（docker）：`docker run` などを受け取り dockerd に送る。複数の daemon と通信できる
  - 原文："the client sends these commands to `dockerd`, which carries them out"
- 命令の流れ：利用者 → docker client → dockerd
- Docker Desktop：dockerd・docker・Docker Compose・Kubernetes などをまとめて含むアプリ
- Docker Compose：複数コンテナのアプリを扱う別のクライアント
- レジストリ：イメージの保管場所。Docker Hub が既定。`docker pull` / `docker push`
- 原文："A container is a runnable instance of an image."
- コンテナを削除すると、永続ストレージにない状態の変更は消える

出典：https://docs.docker.com/engine/

- Docker Engine ＝ サーバー（dockerd）・API・CLI（docker）の3つ。クライアント・サーバー型のアプリ
  - 原文："acts as a client-server application"
- 原文："The daemon creates and manages Docker objects"

出典：https://docs.docker.com/engine/storage/

- 書き込み層に書いたデータは、コンテナを消すと残らない
  - 原文："Data written to the container layer doesn't persist when the container is destroyed."
- ボリューム：デーモンが管理するホストのファイルシステム上。コンテナ削除後も残る
  - 注意（原文）："Directly accessing or interacting with the volume data is unsupported"
- bind mount：ホスト上の任意のファイル・ディレクトリ（"allowing access to files or directories stored anywhere on the host"）
- tmpfs：ホストのメモリ上。ディスクには書かない。停止・再起動で消える（"ensuring the data is not written to disk"）
- イメージマウント・名前付きパイプもあるが、この資料では扱わない
- どの方式でも、コンテナの中からはディレクトリかファイルとして同じように見える

## 0. コンテナの基本・Windows と Linux

出典：https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/

- コンテナはホストOSのカーネルの上で動く
- VM は「自分のカーネルを含む完全なOS」を動かす（原文："a virtual machine (VM) runs a complete operating system–including its own kernel"）
- コンテナはカーネル以外の部品（ユーザーモードのファイル）を「ベースイメージ」として自分で持つ
- Docker Desktop で Windows 用・Linux 用どちらのコンテナも動かせる

出典：https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container

- 分離モードは `process` と `Hyper-V` の2つ。どちらも同じイメージを使う
- process：ホストとも他のコンテナとも同じカーネルを共有（"approximately the same as how Linux containers run"）
- Hyper-V：コンテナごとに軽量VMで "effectively gets its own kernel"
- 既定：Windows Server = process / Windows 10 Pro・Enterprise = Hyper-V
- process だとコンテナ内のプロセスがホストの `get-process` に見える。Hyper-V だと見えず、`vmwp` が見える

出典：https://learn.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility

- process 分離はホストとイメージのビルド番号が違うと起動をブロック
- 例外：Windows 11 ホスト＋Windows Server 2022 イメージ（24H2 以降は 2025 イメージも）
- Hyper-V 分離ならホストとイメージのバージョンが違ってもよい

出典：https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/

- コンテナ = 隔離された独立のプロセス
- 複数のコンテナは同じカーネルを共有する（原文："they all share the same kernel"）

出典：https://docs.docker.com/desktop/features/wsl/

- WSL 2 は Microsoft が作った "a full Linux kernel built by Microsoft"
- Docker Desktop は WSL 2 の上で Linux コンテナを動かす
- 「Switch to Linux containers」というメニューがある（Windows コンテナモードとの切り替え）

## 1. イメージ

出典：https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/

- イメージ = コンテナを動かすのに必要なファイル・バイナリ・ライブラリ・設定をまとめた標準化パッケージ
  - 原文："a standardized package that includes all of the files, binaries, libraries, and configurations"
- **不変**：一度作ったら変更できない
  - 原文："Once an image is created, it can't be modified."
- **レイヤー構造**：各レイヤー = ファイルの追加・削除・変更の差分
- 既存イメージの上に重ねて拡張できる（例：Pythonイメージ + アプリ）
- Docker Hub = イメージを保存・配布する既定のレジストリ
  - 原文："the default global marketplace for storing and distributing images"
- `docker image history` で各レイヤーのサイズと作成コマンドを確認できる

出典：https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/

- レイヤーは作成後に変更できない（immutable）
- 同じベースレイヤーを別イメージで共有 → ビルド高速化・容量と帯域の節約
- コンテナ起動時、ユニオンファイルシステムでレイヤーを重ねて1つのビューにする
- コンテナ専用の**書き込み層**が別に作られる → 元のイメージは変わらない
- 同じイメージから複数コンテナを起動できる

出典：https://docs.docker.com/build/cache/

- Dockerfile の各命令 = 最終イメージの1レイヤー
- 変更があったレイヤーは再構築が必要
  - 原文："Whenever a layer changes, that layer will need to be re-built."
- 後ろのレイヤーも全部再実行される
  - 原文："Even if they wouldn't build anything differently, they still need to re-run."
- ※「命令の順序が大事」は原文が直接の推奨として書いているわけではなく、上の仕組みからの読み取り

## 2. ネットワーク

出典：https://docs.docker.com/engine/network/

- コンテナは既定でネットワークが有効（外部へ接続できる）
- ドライバー（Linux）
  - bridge：既定。`--network` 未指定ならデフォルトbridgeに接続
  - host：コンテナとホストのネットワーク隔離をなくす
  - none：ホストや他コンテナから完全に隔離
  - overlay：Swarm用。複数のDockerデーモンを接続
  - ipvlan：コンテナを外部VLANに接続
  - macvlan：ホストのネットワーク上で独立したデバイスとして見える
- コンテナ間通信
  - デフォルトbridge：IPアドレスのみ（名前は不可）
  - ユーザー定義ネットワーク：IPアドレスまたはコンテナ名
- ポート公開：ホスト外からアクセスさせるには `--publish` / `-p`
- DNS：ユーザー定義ネットワークでは組み込みDNS（`127.0.0.11`）が使われる

出典：https://docs.docker.com/engine/network/drivers/bridge/

- 原文："User-defined bridge networks are superior to the default `bridge` network."
- 比較

| 項目 | デフォルトbridge | ユーザー定義bridge |
|---|---|---|
| 名前解決 | IPのみ（`--link` はレガシー） | 名前・エイリアスで自動解決 |
| 隔離 | `--network` 未指定の全コンテナが同居 | 接続したコンテナだけが通信 |
| 接続・切断 | コンテナを作り直す必要あり | 実行中でも付け外し可能 |

- デフォルトbridgeは本番利用が推奨されていない

出典（Windowsコンテナ）：https://learn.microsoft.com/en-us/virtualization/windowscontainers/container-networking/network-drivers-topologies

- ※ Roze さんのPCは Windows コンテナ。Linux用のドライバー名とは別物
- Windows のドライバー：**nat（既定）** / transparent / overlay / l2bridge / l2tunnel（Azure専用）
- nat：内部Hyper-Vスイッチに接続。ホストからのポート転送に対応。開発者向け
- transparent：外部Hyper-Vスイッチで物理ネットワークに直結
- Windows の nat では同一サブネット内のコンテナ間通信が可能（サブネットをまたぐ通信は非対応）

## 3. ボリューム

出典：https://docs.docker.com/engine/storage/volumes/

- 原文："Volumes are persistent data stores for containers, created and managed by Docker."
- 実体は Docker ホスト上のディレクトリ。コンテナにマウントして使う
- `docker volume create` で作る、または自動作成される
- **コンテナを消してもボリュームは残る**（書き込み層は消える）
- 使われていないボリュームは自動削除されない → `docker volume prune`
- bind mount との違い
  - bind mount：ホストのディレクトリ構造・OSに依存
  - ボリューム：原文 "volumes are completely managed by Docker"
  - ホストからも同じファイルを触りたいときは bind mount が向く
- 利点：バックアップ・移行が容易 / CLI・APIで管理 / Linux・Windows両対応 /
  複数コンテナで共有 / 高性能I/O
- 非永続データは tmpfs mount を検討（原文："consider using a tmpfs mount"）

## 取得できていない／未確認の点

- Windows コンテナ側のボリューム・bind mount の仕様差（パスの書き方など）
- Windows コンテナで Linux 用の `host` / `none` ネットワークが使えるか
- Windows コンテナでの tmpfs の可否
- overlay2 などストレージドライバーの詳細（今回は対象外）

## 選び方・周辺技術（choose.html）

取得日：2026-10-12

- **Docker Desktop のライセンス**（https://docs.docker.com/subscription/desktop-license/）
  - 無料：小規模企業（250人未満かつ年商1,000万ドル未満）、個人、教育、非商用OSS
  - 有償：大きな組織での業務利用、政府機関、無料枠を超える商用利用
  - Docker Engine など OSS のライセンスは変更されていない
- **Docker Desktop for Windows の要件**（https://docs.docker.com/desktop/setup/install/windows-install/）
  - バックエンド：WSL 2（既定）、Hyper-V、Docker VMM（Beta）
  - Windows 11：Enterprise / Pro / Education 23H2 以上。Home は要件のリストにない（可否は未確認）
  - Windows コンテナ：Pro / Enterprise、all-users インストールのとき
- **Windows コンテナの環境**（https://learn.microsoft.com/en-us/virtualization/windowscontainers/quick-start/set-up-environment）
  - Windows 10/11：Professional または Enterprise、Hyper-V 有効
  - Windows Server のランタイム：Moby（Docker CE）、Mirantis Container Runtime、containerd（nerdctl は Docker 互換CLI）
- **WSL 2**（https://learn.microsoft.com/en-us/windows/wsl/about）
  - 軽量なユーティリティVMの中で Linux カーネルを動かす
- **WSL container**（https://learn.microsoft.com/en-us/windows/wsl/wsl-container）
  - `wslc.exe`（Linux コンテナを build / run する CLI）と、WSL container API（NuGet: Microsoft.WSL.Containers）
  - WSL 2.9.3 以上が必要（ページ更新日 2026-09-29）
- **WSLC のアーキテクチャ**（https://devblogs.microsoft.com/commandline/wslc-architecture-deep-dive/）
  - wslservice.exe（特権サービス）→ wslcsession.exe（ユーザーの代わりに動く）
  - セッションごとに専用の VHD。Windows パスは virtiofs（Plan9 の約2倍速）
  - ネットワークは新しいモデル「Consommé」
  - 専用VMかどうか、使うカーネルは「記載なし」
- **WSL のリリース**（https://github.com/microsoft/WSL/releases）
  - 3.0.1（2026/9/29）：「WSLc is generally available」。3.0.3 でカーネル 6.18.54.1
  - 「WSL 3」という名称は記載なし（3.0.x のバージョン番号のみ）
- **OCI**（https://opencontainers.org/about/overview/）
  - Runtime / Image / Distribution の3仕様。runC は Docker が寄贈（"the cornerstone of this new effort"）
- **containerd**（https://containerd.io/）
  - コンテナのライフサイクル全体を管理する industry-standard container runtime。CNCF 卒業（2019-02-28）
  - "OCI Runtime Spec support (aka runC)"
- **Podman**（https://docs.podman.io/en/latest/）
  - daemonless。Docker 互換の CLI。root でも一般ユーザーでも実行可。runc / crun などの OCI 準拠ランタイムに頼る
- **Kubernetes のコンテナランタイム**（https://kubernetes.io/docs/setup/production-environment/container-runtimes/）
  - CRI 準拠のランタイムが必要。例：containerd、CRI-O、Docker Engine、Mirantis Container Runtime
  - dockershim は 1.24 で削除
- **PowerShell**（https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell）
  - 5.1 は .NET Framework 4.5 上。6.0 以降は .NET Core 上でクロスプラットフォーム（Windows / macOS / Linux）
- **.NET**（https://learn.microsoft.com/en-us/dotnet/core/introduction）／**.NET Framework**（https://learn.microsoft.com/en-us/dotnet/framework/get-started/overview）
  - .NET：無料・クロスプラットフォーム・オープンソース
  - .NET Framework：Windows アプリと Web サービス向け。新規開発では .NET を使うよう案内。IIS がホストできる

### 確認できていない／筆者の整理

- WSL Containers が Docker Compose に未対応であること（報道のみ。Microsoft の公式ページでは未確認）
- dockerd → containerd → runc の呼び出しの順（公式ページに明記なし）
- Windows 11 Home での Docker Desktop の可否（要件のリストにない）
- Windows Server に Linux コンテナを直接載せない理由・可否（現行の公式ページでは未確認）
- GUI・Excel 操作のアプリがコンテナに向かないこと（筆者の整理）
- 「層の分け方」（規格／低レベルランタイム／コンテナランタイム／エンジン／クラスタ管理）は筆者の整理