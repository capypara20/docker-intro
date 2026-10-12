/* ===== terms.js : 用語辞書（用語マップの箱をクリックしたときに出る説明） =====
 *
 * name … 用語の名前
 * def  … 意味（やさしい言葉で）
 * rel  … 入れ子以外の関係。先頭の記号で種類を表す
 *          ← 〜から作られる / → 〜に命令する・〜になる / ⇄ 行き来する
 *          ⇢ 〜を借りる・共有する / ＝ 同じ意味・言い換え / ✕ 注意
 * src  … 出典（空なら「一般的な用語の説明」と表示される）
 *
 * 「入れ子」（何の中にあるか・何が入っているか）は、図のHTMLの入れ子から自動で表示される。
 */
(() => {
  'use strict';

  const S = {
    overview:  ['Docker Docs「Docker overview」', 'https://docs.docker.com/get-started/docker-overview/'],
    engine:    ['Docker Docs「Docker Engine」', 'https://docs.docker.com/engine/'],
    image:     ['Docker Docs「What is an image?」', 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/'],
    layers:    ['Docker Docs「Understanding the image layers」', 'https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/'],
    cache:     ['Docker Docs「Docker build cache」', 'https://docs.docker.com/build/cache/'],
    container: ['Docker Docs「What is a container?」', 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/'],
    msAbout:   ['Microsoft Learn「About Windows containers」', 'https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/'],
    msIso:     ['Microsoft Learn「Isolation modes」', 'https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container'],
    wsl:       ['Docker Docs「Docker Desktop WSL 2 backend on Windows」', 'https://docs.docker.com/desktop/features/wsl/'],
    net:       ['Docker Docs「Networking overview」', 'https://docs.docker.com/engine/network/'],
    bridge:    ['Docker Docs「Bridge network driver」', 'https://docs.docker.com/engine/network/drivers/bridge/'],
    msNet:     ['Microsoft Learn「Windows container network drivers」', 'https://learn.microsoft.com/en-us/virtualization/windowscontainers/container-networking/network-drivers-topologies'],
    storage:   ['Docker Docs「Storage」', 'https://docs.docker.com/engine/storage/'],
    volumes:   ['Docker Docs「Volumes」', 'https://docs.docker.com/engine/storage/volumes/'],
    multi:     ['Docker Docs「Multi-container applications」', 'https://docs.docker.com/get-started/docker-concepts/running-containers/multi-container-applications/'],
    composeNet: ['Docker Docs「Networking in Compose」', 'https://docs.docker.com/compose/how-tos/networking/'],
    composeDown: ['Docker Docs「docker compose down」', 'https://docs.docker.com/reference/cli/docker/compose/down/'],
    nodeGuide: ['Docker Docs「Develop your Node.js app」', 'https://docs.docker.com/guides/nodejs/develop/'],
    hubPg:     ['Docker Hub「postgres」（公式イメージ）', 'https://hub.docker.com/_/postgres'],
    msPersist: ['Microsoft Learn「Persistent storage in containers」', 'https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/persistent-storage'],
    msVer:     ['Microsoft Learn「Windows container version compatibility」', 'https://learn.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility'],
    oci:          ['OCI「Overview」', 'https://opencontainers.org/about/overview/'],
    containerd:   ['containerd', 'https://containerd.io/'],
    podman:       ['Podman Docs', 'https://docs.podman.io/en/latest/'],
    k8sRuntime:   ['Kubernetes Docs「Container Runtimes」', 'https://kubernetes.io/docs/setup/production-environment/container-runtimes/'],
    wslAbout:     ['Microsoft Learn「What is Windows Subsystem for Linux」', 'https://learn.microsoft.com/en-us/windows/wsl/about'],
    wslContainer: ['Microsoft Learn「WSL container」', 'https://learn.microsoft.com/en-us/windows/wsl/wsl-container'],
    wslcArch:     ['Windows Command Line「WSLC Architecture deep dive」', 'https://devblogs.microsoft.com/commandline/wslc-architecture-deep-dive/'],
    wslReleases:  ['GitHub「microsoft/WSL Releases」', 'https://github.com/microsoft/WSL/releases'],
    desktopLicense: ['Docker Docs「Docker Desktop license」', 'https://docs.docker.com/subscription/desktop-license/'],
    desktopWin:   ['Docker Docs「Install Docker Desktop on Windows」', 'https://docs.docker.com/desktop/setup/install/windows-install/'],
    msSetup:      ['Microsoft Learn「Prepare Windows operating system containers」', 'https://learn.microsoft.com/en-us/virtualization/windowscontainers/quick-start/set-up-environment'],
    psDiff:       ['Microsoft Learn「Differences between Windows PowerShell 5.1 and PowerShell 7.x」', 'https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell'],
    dotnet:       ['Microsoft Learn「Introduction to .NET」', 'https://learn.microsoft.com/en-us/dotnet/core/introduction'],
    dotnetFw:     ['Microsoft Learn「Overview of .NET Framework」', 'https://learn.microsoft.com/en-us/dotnet/framework/get-started/overview'],
  };

  window.TERMS = {
    /* ---------- 全体像 ---------- */
    user: {
      name: 'あなた（利用者）',
      def: 'docker コマンドを打つ人。',
      rel: ['→ 命令は「あなた → docker → dockerd」の順に流れる'],
      src: [S.overview],
    },
    cli: {
      name: 'docker（クライアント / CLI）',
      def: '利用者が操作する入口。docker run などのコマンドを受け取り、dockerd に送って実行させる。',
      rel: ['→ Docker API を通して dockerd に命令を送る', '＝ Docker Compose も、複数コンテナのアプリを扱う別のクライアント'],
      src: [S.overview, S.engine],
    },
    api: {
      name: 'Docker API',
      def: 'プログラムが dockerd と通信して指示を出すための窓口。REST API で、UNIXソケットかネットワークを通る。',
      rel: ['← docker（CLI）や、ほかのアプリが、これを使って dockerd を操作する'],
      src: [S.engine, S.overview],
    },
    dockerd: {
      name: 'dockerd（Docker デーモン）',
      def: '裏で動き続けるサーバー側のプロセス。API のリクエストを受け付け、イメージ・コンテナ・ネットワーク・ボリュームを作って管理する。ビルド・実行・レジストリとのやり取りといった実際の作業は、ここが担う。',
      rel: ['→ Docker オブジェクトを作って管理する', '⇄ レジストリから、イメージを取得（pull）・送信（push）する'],
      src: [S.overview, S.engine],
    },
    engine: {
      name: 'Docker Engine',
      def: 'アプリの構築とコンテナ化に使うオープンソースの技術。サーバー（dockerd）・API・CLI（docker）の3つでできた、クライアント・サーバー型のアプリ。',
      rel: ['＝ docker（CLI）＋ Docker API ＋ dockerd', '＝ Kubernetes のコンテナランタイムの例として、公式に挙げられている（dockershim は 1.24 で削除）'],
      src: [S.engine, S.k8sRuntime],
    },
    desktop: {
      name: 'Docker Desktop',
      def: 'Mac・Windows・Linux に簡単に入れられるアプリ。dockerd・docker・Docker Compose・Kubernetes などをまとめて含む。',
      rel: ['＝ Engine の部品に、Compose などを足した「まとめパック」'],
      src: [S.overview],
    },
    compose: {
      name: 'Docker Compose',
      def: '複数のコンテナからなるアプリを扱うための、もう1つのクライアント。',
      rel: ['→ クライアントなので、docker と同じく dockerd に命令を送る側'],
      src: [S.overview],
    },
    kubernetes: {
      name: 'Kubernetes',
      def: 'Docker Desktop に含まれると、公式に書かれている仕組み。この資料では扱いません。',
      rel: [],
      src: [S.overview],
    },
    objects: {
      name: 'Docker オブジェクト',
      def: 'dockerd が作って管理するものの総称。イメージ・コンテナ・ネットワーク・ボリューム（ほかにプラグインなど）。',
      rel: ['← dockerd が作って管理する'],
      src: [S.overview],
    },
    registry: {
      name: 'レジストリ',
      def: 'イメージを保管・配布する場所。Docker Hub は誰でも使える公開レジストリで、Docker は既定でそこからイメージを探す。自前のプライベートレジストリも使える。',
      rel: ['⇄ docker pull で取得、docker push で送信（実際の作業は dockerd が行う）'],
      src: [S.overview, S.image],
    },

    /* ---------- コンテナの基本 ---------- */
    pc: {
      name: '物理PC',
      def: 'コンピューター本体（ハードウェア）。この上に OS が入る。',
      rel: [],
      src: [],
    },
    os: {
      name: 'OS（オペレーティングシステム）',
      def: 'カーネルと、ユーザーモードのファイル（ライブラリなど）でできている。',
      rel: ['＝ カーネル ＋ ユーザーモードのファイル'],
      src: [S.msAbout],
    },
    hostos: {
      name: 'ホストOS',
      def: 'コンテナを動かす土台になる OS。コンテナは、この OS のカーネルを借りて動く（プロセス分離の場合）。',
      rel: ['⇢ コンテナに、カーネルを貸す', '＝ OS ＝ カーネル ＋ ユーザーモードのファイル'],
      src: [S.msAbout, S.msIso],
    },
    kernel: {
      name: 'カーネル',
      def: 'OS の心臓部（公式の言い方では「OS の見えない配管」）。コンテナはホストのカーネルの上で動き、共有する。ただし無制限には触れず、隔離された見え方だけが与えられる。',
      rel: ['⇢ コンテナは、これを自分では持たず、ホストのものを借りる'],
      src: [S.msAbout],
    },
    usermode: {
      name: 'ユーザーモードのファイル',
      def: 'カーネルの上で動く OS の部品（ライブラリなど）。カーネルが提供しない API やサービスを、ここが担う。コンテナはホストのユーザーモード環境から隔離されているので、自分用のコピーを持つ。',
      rel: ['＝ これをまとめたものが「ベースイメージ」'],
      src: [S.msAbout],
    },
    baseimage: {
      name: 'ベースイメージ',
      def: 'コンテナの土台になるイメージ。OS の部品（ユーザーモードのファイル）をまとめたもの。Microsoft の例：Windows / Windows Server / Server Core / Nano Server。',
      rel: ['→ この上に、自分のアプリを重ねてイメージを作る'],
      src: [S.msAbout],
    },
    app: {
      name: 'アプリ',
      def: 'コンテナの中で動かしたいプログラム。',
      rel: [],
      src: [],
    },
    wsl2: {
      name: 'WSL 2',
      def: 'Microsoft が作った「完全な Linux カーネル」。仮想マシンを自分で管理しなくても Linux を動かせる。Docker Desktop は Linux コンテナを、この上で動かす。',
      rel: ['＝ Linux コンテナには Linux のカーネルが要るので、Windows PC ではこれが土台になる（公式の記述からの読み取り）'],
      src: [S.wsl],
    },
    lightvm: {
      name: '軽量VM（Hyper-V 分離）',
      def: 'Hyper-V 分離のコンテナを包む、最適化された小さな仮想マシン。コンテナは実質的に専用のカーネルを持ち、ホストとの間にハードウェアレベルの隔離ができる。',
      rel: ['✕ ホストの Get-Process には、中のプロセスが見えない（かわりに vmwp が見える）', '＝ ホストとバージョンが違っても動かせる'],
      src: [S.msIso],
    },
    ctr_linux: {
      name: 'Linux コンテナ',
      def: 'Linux 用のアプリと Linux 用のファイルを入れたコンテナ。Linux のカーネルが必要なので、Windows PC では WSL 2 のような Linux の土台の上で動く。',
      rel: ['⇢ 借りるのは Windows ではなく、Linux のカーネル'],
      src: [S.wsl, S.container],
    },
    ctr_win: {
      name: 'Windows コンテナ',
      def: 'Windows 用のアプリと Windows 用のファイルを入れたコンテナ。分離モードは2つ：プロセス分離（ホストのカーネルを共有）と、Hyper-V 分離（コンテナごとに軽量VM）。',
      rel: ['⇢ プロセス分離ならホストの Windows カーネルを借りる', '⇢ Hyper-V 分離なら、軽量VMの中の専用カーネルを使う'],
      src: [S.msIso, S.msAbout],
    },

    /* ---------- イメージ ---------- */
    dockerfile: {
      name: 'Dockerfile',
      def: 'イメージの作り方を書いた設計図。各命令が、イメージの1つの層になる。',
      rel: ['→ docker build でイメージになる'],
      src: [S.cache, S.overview],
    },
    image: {
      name: 'イメージ',
      def: '読み取り専用のテンプレート。コンテナを動かすのに必要なファイル・設定をまとめた標準化パッケージ。作成後は変更できない。',
      rel: [
        '← Dockerfile から docker build で作られる',
        '→ docker run で、実行可能なコンテナになる',
        '⇄ レジストリで保管・配布される',
        '＝ 複数のレイヤー（層）が積み重なったもの',
      ],
      src: [S.image, S.overview, S.layers],
    },
    layer: {
      name: 'レイヤー（層）',
      def: 'ファイルの追加・削除・変更の差分。作成後は変更できず、別のイメージと共有できる。Dockerfile の各命令が1つのレイヤーを作る。',
      rel: ['＝ 積み重なって、1つのイメージになる', '⇢ 同じ土台の層を、別のイメージと共有できる'],
      src: [S.layers, S.cache],
    },
    layer_ro: {
      name: 'イメージの層（読み取り専用）',
      def: 'コンテナの下に敷かれる、イメージのレイヤー。読み取り専用で、同じイメージから起動したほかのコンテナと共有される。',
      rel: ['⇢ 同じイメージから起動した、ほかのコンテナと共有される'],
      src: [S.layers],
    },
    writable: {
      name: '書き込み層',
      def: 'コンテナ専用の層。コンテナの中での変更は、ここに書かれる。元のイメージは変わらない。',
      rel: ['✕ コンテナを削除すると、一緒に消える', '＝ イメージの層（読み取り専用）の上に、1枚だけ乗る'],
      src: [S.layers, S.storage],
    },
    unionfs: {
      name: 'ユニオンファイルシステム',
      def: '複数のレイヤーを重ねて、1つのまとまったビューとして見せる仕組み。',
      rel: ['→ コンテナ起動時に、層を重ねて1つに見せる'],
      src: [S.layers],
    },
    container: {
      name: 'コンテナ',
      def: 'イメージを実行可能にしたもの（公式：「A container is a runnable instance of an image.」）。必要なファイルをすべて持った、隔離された独立のプロセス。',
      rel: [
        '← イメージ（読み取り専用の層）＋ コンテナ専用の書き込み層',
        '⇢ ホストOSのカーネルを共有する',
        '✕ 削除すると、書き込み層のデータは消える',
      ],
      src: [S.container, S.overview, S.layers],
    },

    /* ---------- ネットワーク ---------- */
    dockerhost: {
      name: 'Docker ホスト',
      def: 'Docker（dockerd）が動いているコンピューター。ネットワークもボリュームも、ここの上に作られる。',
      rel: [],
      src: [S.storage],
    },
    network: {
      name: 'ネットワーク',
      def: 'コンテナが、外やほかのコンテナと通信するための通り道。コンテナは既定でネットワークが有効で、外への接続もできる。',
      rel: ['＝ 種類（動き方）は「ドライバー」で決まる', '⇄ 1つのコンテナを、複数のネットワークに同時につなげられる'],
      src: [S.net],
    },
    net_default: {
      name: 'デフォルト bridge',
      def: '--network を指定しないコンテナが、自動でつながるネットワーク。コンテナどうしは IP アドレスでしか通信できず、名前では呼べない。本番での利用は推奨されていない。',
      rel: ['✕ 実行中のコンテナの付け外しはできない（作り直しが必要）', '✕ つながっている全コンテナが、お互いに通信できてしまう'],
      src: [S.bridge, S.net],
    },
    net_user: {
      name: 'ユーザー定義 bridge',
      def: 'docker network create で自分で作る bridge ネットワーク。接続したコンテナだけが通信でき、名前でも呼べる（自動の名前解決）。',
      rel: ['⇄ 実行中でも接続・切断できる', '＝ 公式は「デフォルト bridge より優れている」と明記'],
      src: [S.bridge, S.net],
    },
    ctr_multi: {
      name: 'コンテナ（複数のネットワークに接続）',
      def: '1つのコンテナを、複数のネットワークに同時につなげられる。',
      rel: ['⇄ つないだネットワークごとに、それぞれの相手と通信できる'],
      src: [S.net],
    },
    driver: {
      name: 'ネットワークドライバー',
      def: 'ネットワークの「種類（動き方）」を決める部品。docker network create -d <ドライバー名> で指定する。',
      rel: ['＝ Linux コンテナと Windows コンテナで、名前も種類も違う'],
      src: [S.net, S.msNet],
    },
    grp_linux: {
      name: 'Linux コンテナ用のドライバー',
      def: 'Docker 公式のネットワーク概要ページに載っている、Linux 向けのドライバーの一覧。',
      rel: [],
      src: [S.net],
    },
    grp_win: {
      name: 'Windows コンテナ用のドライバー',
      def: 'Microsoft Learn に載っている、Windows コンテナ向けのドライバーの一覧。',
      rel: ['✕ Linux 用の host / none を、そのまま当てはめてはいけない（Windows での扱いは今回未確認）'],
      src: [S.msNet],
    },
    drv_bridge: {
      name: 'bridge',
      def: 'Linux 側の既定のドライバー。--network を指定しないコンテナは、デフォルト bridge につながる。',
      rel: ['＝ デフォルト bridge と ユーザー定義 bridge の2種類がある'],
      src: [S.net, S.bridge],
    },
    drv_host: {
      name: 'host',
      def: 'コンテナと Docker ホストの間の、ネットワークの隔離をなくす。',
      rel: [],
      src: [S.net],
    },
    drv_none: {
      name: 'none',
      def: 'コンテナを、ホストや他のコンテナから完全に隔離する。',
      rel: [],
      src: [S.net],
    },
    drv_overlay: {
      name: 'overlay',
      def: '複数の Docker デーモン（＝複数のホスト）をつなぐ。Swarm や Kubernetes などで使う。Linux にも Windows にもある。',
      rel: [],
      src: [S.net, S.msNet],
    },
    drv_macvlan: {
      name: 'macvlan',
      def: 'コンテナを、ホストのネットワーク上の独立した機器のように見せる。',
      rel: [],
      src: [S.net],
    },
    drv_ipvlan: {
      name: 'ipvlan',
      def: 'コンテナを、外部の VLAN につなぐ。',
      rel: [],
      src: [S.net],
    },
    drv_nat: {
      name: 'nat（Windows の既定）',
      def: 'Windows コンテナの既定のドライバー。内部の Hyper-V スイッチにつなぎ、ホストからコンテナへのポート転送に対応する。開発者向け。',
      rel: ['＝ Linux の bridge にあたる位置づけ（公式の記述からの読み取り）'],
      src: [S.msNet],
    },
    drv_transparent: {
      name: 'transparent',
      def: '外部の Hyper-V スイッチで、コンテナを物理ネットワークに直接つなぐ。',
      rel: [],
      src: [S.msNet],
    },
    drv_l2bridge: {
      name: 'l2bridge',
      def: '外部の Hyper-V スイッチで物理ネットワークにつなぐ。コンテナの通信は、ホストと同じ MAC アドレスに書き換えられる。Kubernetes や Microsoft SDN で使われる。',
      rel: [],
      src: [S.msNet],
    },
    drv_l2tunnel: {
      name: 'l2tunnel',
      def: '作り方は l2bridge と同じ。Microsoft のクラウド（Azure）専用。',
      rel: [],
      src: [S.msNet],
    },

    /* ---------- ボリューム ---------- */
    storage_group: {
      name: 'データの置き場所（コンテナの外）',
      def: 'コンテナの書き込み層とは別に、コンテナの外にデータを置く方法の置き場。ボリューム・bind mount・tmpfs の3つがある。',
      rel: ['⇢ コンテナの「マウント先」から、中に見せる'],
      src: [S.storage],
    },
    dockerarea: {
      name: 'Docker が管理する領域',
      def: 'ホストのファイルシステム上にある、Docker デーモンが管理する場所。ボリュームの実体は、ここに置かれる。',
      rel: [],
      src: [S.storage, S.volumes],
    },
    volume: {
      name: 'ボリューム',
      def: 'Docker が作って管理する、コンテナ用の永続データの置き場。実体は Docker ホスト上のディレクトリで、コンテナにマウントして使う。コンテナを消しても残る。',
      rel: [
        '⇢ コンテナの「マウント先」として見える',
        '✕ 使われていなくても、自動では消えない（docker volume prune で整理）',
        '✕ ホストから直接触ることは、公式では「非対応」とされている',
      ],
      src: [S.volumes, S.storage],
    },
    hostdir: {
      name: 'ホスト上の好きな場所',
      def: 'bind mount の元になる、ホスト上の任意のファイルやディレクトリ。',
      rel: [
        '⇢ bind mount で、そのままコンテナに見せる',
        '✕ ホスト側のプロセスも同時に書き換えられるので、注意が必要',
      ],
      src: [S.storage],
    },
    hostmem: {
      name: 'ホストのメモリ',
      def: 'tmpfs mount の中身が置かれる場所。ディスクには書かれない。',
      rel: [],
      src: [S.storage],
    },
    tmpfs: {
      name: 'tmpfs mount',
      def: 'ホストのメモリ上にだけ置かれる、一時的なデータ。ディスクには書かれず、コンテナの停止やホストの再起動で消える。一時的なキャッシュや機密情報に向く。',
      rel: ['？ Windows コンテナで使えるかは、今回の公式ページでは確認できていない'],
      src: [S.storage],
    },
    mountpoint: {
      name: 'マウント先',
      def: 'ボリューム・bind mount・tmpfs を、コンテナの中のディレクトリやファイルとして見せる入り口。どの方式でも、コンテナの中からは同じように見える。',
      rel: ['⇢ 外に置いたデータを、コンテナの中に見せる'],
      src: [S.storage],
    },

    /* ---------- 実例：Web アプリ ＋ DB ---------- */
    browser: {
      name: 'ブラウザ（あなた）',
      def: 'Web アプリを使う側。ホストの公開ポート（例：localhost:3000）に接続する。',
      rel: ['→ ホストの公開ポートから、web コンテナへ届く'],
      src: [S.composeNet],
    },
    web_img: {
      name: 'web イメージ',
      def: 'あなたの Dockerfile から作る、Web アプリのイメージ。compose.yaml では build: . と書く。',
      rel: ['← Dockerfile から作られる（docker build に相当）', '→ docker compose up で、web コンテナになる'],
      src: [S.multi],
    },
    db_img: {
      name: 'postgres イメージ',
      def: 'レジストリ（Docker Hub）にある、PostgreSQL の公式イメージ。compose.yaml では image: postgres:17 のように書く。自分で作らずに、取ってくる。',
      rel: ['⇄ レジストリから pull される', '→ docker compose up で、db コンテナになる'],
      src: [S.hubPg],
    },
    web_ctr: {
      name: 'web コンテナ',
      def: 'Web アプリが動くコンテナ。画面と処理を担当する。',
      rel: ['→ DB には、サービス名「db」で接続する（db:5432）', '⇢ ports で、ホストの 3000 番に公開される', '← web イメージから作られる'],
      src: [S.composeNet, S.nodeGuide],
    },
    db_ctr: {
      name: 'db コンテナ',
      def: 'データベース（PostgreSQL）が動くコンテナ。データの保存を担当する。',
      rel: [
        '← postgres イメージから作られる',
        '✕ ホストの外には公開しない（同じネットワークの web からだけ届く）',
        '⇢ データは、ボリューム db-data に置く',
      ],
      src: [S.nodeGuide, S.hubPg],
    },
    proj_net: {
      name: 'Compose が作るネットワーク',
      def: '「<プロジェクト名>_default」という bridge ネットワーク。docker compose up で自動で作られ、すべてのサービスがつながる。各サービスは名前を内部 DNS に登録するので、サービス名で呼び合える。',
      rel: ['＝ compose.yaml に networks: を書かなくてよい', '⇢ 他のコンテナへは、コンテナ側のポート（5432）で届く'],
      src: [S.composeNet],
    },
    env_pw: {
      name: 'POSTGRES_PASSWORD',
      def: 'PostgreSQL の公式イメージを起動するのに、必須の環境変数。スーパーユーザーのパスワードで、空や未定義ではいけない。',
      rel: ['✕ 例では compose.yaml に直接書いている（学習用）。公式ガイドは、秘密情報用の secrets を使っている'],
      src: [S.hubPg, S.nodeGuide],
    },
    publish: {
      name: 'ports（ポート公開）',
      def: '「ホスト側:コンテナ側」の形式。左がホスト、右がコンテナ。ホストのポートに来た通信を、web コンテナのポートへ転送する。ホスト側のポートは、ネットワークの外から使うときだけ使われる。',
      rel: ['⇢ ブラウザから localhost:ホスト側ポート で開ける', '＝ コンテナどうしの通信では、コンテナ側のポートを使う'],
      src: [S.composeNet, S.msNet],
    },
    nopublish: {
      name: 'ポートを公開しない',
      def: 'db には ports を書かない。ホストの外からは直接届かず、同じネットワークの web からだけ db:5432 で届く。',
      rel: ['＝ DB を外に出さないので、安全側に倒せる（公式ガイドも、5432 をネットワーク内にだけ公開している）'],
      src: [S.composeNet, S.nodeGuide],
    },
    db_volume: {
      name: 'db-data（ボリューム）',
      def: 'DB のデータを置く、名前付きボリューム。コンテナを消しても、データは残る。',
      rel: [
        '⇢ db コンテナのデータ置き場（マウント先）に見える',
        '✕ docker compose down では消えない。docker compose down --volumes で消える',
        '？ マウント先は PostgreSQL のバージョンで違う（17 以前：/var/lib/postgresql/data ／ 18 以降：/var/lib/postgresql）',
      ],
      src: [S.hubPg, S.composeDown, S.volumes],
    },
    compose_frame: {
      name: 'compose.yaml（Docker Compose）',
      def: 'アプリ全体の構成（イメージ・ポート・ボリューム・ネットワーク・環境変数など）を1つの YAML ファイルにまとめる仕組み。docker compose up -d --build の1コマンドで、ネットワークと全コンテナが作られる。',
      rel: ['＝ 複数の docker run を、1ファイルにまとめたもの', '→ docker compose down で、コンテナとネットワークを片付ける'],
      src: [S.multi, S.composeDown],
    },
    /* ---------- 実例：Windows コンテナ版 ---------- */
    mcr: {
      name: 'mcr.microsoft.com',
      def: 'Microsoft のコンテナレジストリ。Windows のベースイメージ（servercore、nanoserver など）は、ここにある。',
      rel: ['⇄ docker pull で取得する（例：mcr.microsoft.com/windows/servercore:ltsc2019）'],
      src: [S.msIso, S.msAbout],
    },
    winweb_img: {
      name: 'web イメージ（Windows）',
      def: 'Windows 用のベースイメージ（例：Server Core）の上に、あなたのアプリを重ねて作る。Rozeさんの dockerimage と同じ形。',
      rel: [
        '← FROM mcr.microsoft.com/windows/servercore:ltsc2025 のように、ベースイメージを指定する',
        '✕ プロセス分離では、ホストの Windows とタグ（版）を合わせる必要がある。Hyper-V 分離なら不要',
      ],
      src: [S.msAbout, S.msVer],
    },
    win_web_ctr: {
      name: 'web コンテナ（Windows）',
      def: 'Windows コンテナで動く Web アプリ。分離モードは2つ：プロセス分離（ホストのカーネルを共有）と Hyper-V 分離（コンテナごとに軽量VM）。',
      rel: ['⇢ nat のポート転送で、ホストのポートに公開される', '⇢ データは、c:\\data などのマウント先に置ける'],
      src: [S.msIso, S.msNet],
    },
    win_db_unknown: {
      name: 'DB（Windows では別の形で用意）',
      def: 'Windows コンテナ側では、DB コンテナの公式の例が見つからなかった。postgres の Docker Hub ページには Windows の記載がなく、SQL Server の公式コンテナイメージ（mcr.microsoft.com/mssql/server）は Linux 向けとされている（複数の解説。公式ページでの確認は未了）。',
      rel: [
        '？ 筆者の整理（公式の例ではない）：① ホストや別のマシンの DB に接続する',
        '？ ② DB だけを Linux コンテナで別に動かす（Windows と Linux のコンテナは、同じ Docker で同時に混ぜられない）',
        '？ ③ ファイル型の DB を、ボリュームに置く',
      ],
      src: [S.hubPg],
    },
    win_volume: {
      name: 'ボリューム / bind mount（Windows）',
      def: 'Windows コンテナでも、名前付きボリュームと bind mount が使える。Windows のパスで書く。',
      rel: [
        '＝ bind mount の例：docker run -v c:\\ContainerData:c:\\data（RO / RW を付けられる）',
        '＝ 名前付きボリュームの例：docker volume create unwound → docker run -v unwound:c:\\data …',
        '✕ プロセス分離では、コンテナ内のプロセスの権限（ACL）でアクセスされる。Hyper-V 分離では LocalSystem',
        '✕ C:\\ のような重要なディレクトリを、信頼できないコンテナに bind mount してはいけない',
        '？ マウント先のパスは、小文字に変換される（c:\\MyData → c:\\mydata）',
      ],
      src: [S.msPersist],
    },
    /* ---------- 選び方・周辺技術：Windows PC で Docker を動かす構成 ---------- */
    vm_linux: {
      name: 'Linux の仮想マシン',
      def: 'Linux をまるごと入れた仮想マシン（VM）。自分専用のカーネルを持つ。この中に Docker Engine を入れて、Linux コンテナを動かす。',
      rel: ['＝ 公式：VM は「自分のカーネルを含む完全な OS」を動かす', '？ VirtualBox・VMware などの具体名は、一般的な話（今回の公式ページでは確認していない）'],
      src: [S.msAbout],
    },
    desktop_win: {
      name: 'Docker Desktop（Windows）',
      def: 'Windows 用の Docker Desktop。バックエンドは WSL 2（既定）と Hyper-V。Linux コンテナが基本で、Windows コンテナは Pro / Enterprise のとき、all-users インストールで使える。',
      rel: ['✕ 大きな組織での業務利用は有償（250人未満かつ年商1,000万ドル未満の小規模企業、個人、教育、非商用OSSは無料）', '＝ Docker Engine 自体のライセンスは、変更されていない'],
      src: [S.desktopWin, S.desktopLicense],
    },
    desktop_distro: {
      name: 'docker-desktop ディストリビューション',
      def: 'Docker Desktop が WSL 2 の中で使う専用のディストリビューション。ほかのディストリビューションとは分離されている。',
      rel: ['＝ ほかのディストリビューションとは、連携を有効にしたときだけやり取りする'],
      src: [S.wsl],
    },
    ubuntu_distro: {
      name: 'Linux ディストリビューション（Ubuntu など）',
      def: 'WSL 2 の中で動く Linux。この中に Docker Engine を直接入れて、Linux コンテナを動かすこともできる。',
      rel: ['✕ Docker Desktop を入れる前に、WSL 内の Docker Engine / CLI は消すよう案内されている'],
      src: [S.wsl, S.wslAbout],
    },
    win_engine: {
      name: 'Docker Engine（Windows 上）',
      def: 'Windows コンテナを動かすエンジン。Windows Server では、Moby（Docker CE）・Mirantis Container Runtime・containerd が、公式に挙げられている。',
      rel: [
        '＝ Windows 10/11 では「Professional または Enterprise」と Hyper-V が必要と、公式に書かれている',
        '？ Rozeさんの PC（Windows 11 Home）では動いた（実機の観察）。公式の要件の外の可能性がある',
      ],
      src: [S.msSetup],
    },
    wslc: {
      name: 'WSL Containers（wslc）',
      def: 'WSL に組み込まれた、Linux コンテナの機能。CLI の wslc.exe と、Windows アプリ向けの API からなる。Docker を別に入れなくてよい。',
      rel: [
        '＝ WSL 2.9.3 以上が必要。一般提供（GA）は WSL 3.0.1（2026/9/29）',
        '＝ 動かすのは Linux コンテナ',
        '？ Docker Compose は未対応と報じられている（Microsoft の公式ページでは確認できていない）',
      ],
      src: [S.wslContainer, S.wslReleases, S.wslcArch],
    },
    wslc_cli: {
      name: 'wslc.exe',
      def: 'WSL に組み込まれた CLI。Linux コンテナを作る・動かす・操作する。docker に似たコマンド（run、image ls、container ps など）で使う。',
      rel: ['⇢ 内部では、wslservice.exe を呼び出す'],
      src: [S.wslContainer, S.wslcArch],
    },
    wslc_service: {
      name: 'WSL（wslservice.exe）',
      def: '特権を持つ Windows サービス。HCS で仮想マシンを作るが、VM の持ち主にはならず、セッション用の子プロセス wslcsession.exe を作る。',
      rel: ['→ セッションごとに、別のプロセスで動かす（セッション間の分離を強くするため）'],
      src: [S.wslcArch],
    },
    wslc_session: {
      name: 'wslcsession.exe（セッション）',
      def: '呼び出したユーザーの代わりに動くプロセス。コンテナの作成、ディレクトリのマウント、ポートのバインドなどを行う。セッションごとに専用の VHD を持つ。',
      rel: ['＝ Windows のパスは、virtiofs の共有としてマウントされる（Plan9 の約2倍速と説明）', '＝ ネットワークは、新しいモデル「Consommé」（VPN・ファイアウォールとの互換性が高いと説明）'],
      src: [S.wslcArch],
    },

    /* ---------- 選び方・周辺技術：コンテナ技術の全体地図 ---------- */
    l_orch: {
      name: '層：クラスタの管理',
      def: '多数のコンテナを、複数のマシンにまたがって管理する層。（この層分けは、筆者の整理です。公式の分類ではありません）',
      rel: [],
      src: [],
    },
    l_tools: {
      name: '層：利用者が使うエンジン・ツール',
      def: 'あなたが docker や podman などのコマンドで触る層。（この層分けは、筆者の整理です。公式の分類ではありません）',
      rel: [],
      src: [],
    },
    l_runtime: {
      name: '層：コンテナランタイム',
      def: 'コンテナのライフサイクルを管理する層。（この層分けは、筆者の整理です。公式の分類ではありません）',
      rel: [],
      src: [],
    },
    l_low: {
      name: '層：低レベルランタイム',
      def: '実際にコンテナのプロセスを作って動かす層。（この層分けは、筆者の整理です。公式の分類ではありません）',
      rel: [],
      src: [],
    },
    l_spec: {
      name: '層：規格（OCI）',
      def: 'コンテナの形式やランタイムの「決まりごと」。どのツールも、これに沿って作られる。',
      rel: [],
      src: [S.oci],
    },
    oci: {
      name: 'OCI（Open Container Initiative）',
      def: 'コンテナの形式とランタイムの業界標準を作るためのプロジェクト。Linux Foundation の下で、2015年6月22日に Docker、CoreOS などが発足させた。',
      rel: ['＝ 3つの仕様：Runtime / Image / Distribution'],
      src: [S.oci],
    },
    oci_runtime: {
      name: 'Runtime Specification',
      def: 'ディスク上に展開された「filesystem bundle」を、どう実行するかを定める仕様。',
      rel: ['⇢ runc が、これに沿ったランタイム'],
      src: [S.oci],
    },
    oci_image: {
      name: 'Image Specification',
      def: 'OCI イメージの作り方を定める仕様。イメージは、マニフェスト・ファイルシステムのレイヤー・イメージ設定でできている。',
      rel: [],
      src: [S.oci],
    },
    oci_dist: {
      name: 'Distribution Specification',
      def: 'コンテナイメージを配布するための API を標準化する仕様。2020年5月に v1.0。コンテナ以外のコンテンツの配布にも使えるよう、汎用に作られている。',
      rel: ['⇄ レジストリが、これに沿ってイメージを配る（読み取り）'],
      src: [S.oci],
    },
    runc: {
      name: 'runc（runC）',
      def: 'Docker が OCI に寄贈した、コンテナの形式とランタイム。OCI の取り組みの「cornerstone（礎）」と位置づけられている。',
      rel: [
        '⇢ containerd は「OCI Runtime Spec support (aka runC)」を機能として挙げている',
        '⇢ Podman は、runc や crun などの OCI 準拠のランタイムを使う',
      ],
      src: [S.oci, S.containerd, S.podman],
    },
    crun: {
      name: 'crun',
      def: 'Podman のページで、runc と並べて挙げられている、OCI 準拠のランタイム。',
      rel: [],
      src: [S.podman],
    },
    containerd: {
      name: 'containerd',
      def: 'ホスト上のコンテナのライフサイクル全体（イメージの転送と保存、コンテナの実行と監視、低レベルのストレージとネットワーク）を管理する、業界標準のコンテナランタイム。Linux と Windows の両方に、デーモンがある。',
      rel: [
        '＝ 2019年2月28日に CNCF の「卒業」プロジェクトになった',
        '⇢ Kubernetes のコンテナランタイムの例として、公式に挙げられている',
        '⇄ nerdctl という、Docker 互換の CLI がある',
        '＝ Windows Server で使えるランタイムとして、Microsoft も挙げている',
      ],
      src: [S.containerd, S.k8sRuntime, S.msSetup],
    },
    crio: {
      name: 'CRI-O',
      def: 'Kubernetes のコンテナランタイムの例として、公式に挙げられているもの。',
      rel: [],
      src: [S.k8sRuntime],
    },
    podman: {
      name: 'Podman',
      def: 'コンテナやイメージを、見つけ・実行し・ビルドし・共有し・デプロイするためのツール。「daemonless（デーモンを持たない）」。Docker に慣れた人が使える CLI を持ち、root でも一般ユーザーでも実行できる。',
      rel: [
        '⇢ コンテナの作成は、OCI 準拠のランタイム（runc、crun など）に頼る',
        '＝ 作ったコンテナは、他の一般的なコンテナエンジンのものと、ほぼ区別がつかない',
      ],
      src: [S.podman],
    },
    nerdctl: {
      name: 'nerdctl',
      def: 'containerd 用の、Docker 互換のコマンドラインツール。',
      rel: ['⇢ containerd を、docker のようなコマンドで操作できる'],
      src: [S.msSetup],
    },
    k8s: {
      name: 'Kubernetes',
      def: 'クラスタの各ノードに、Pod を動かすためのコンテナランタイムを入れて使う。ランタイムは、CRI（Container Runtime Interface）に準拠している必要がある。',
      rel: [
        '＝ ランタイムの例：containerd、CRI-O、Docker Engine、Mirantis Container Runtime',
        '✕ Docker Engine との直接の統合（dockershim）は、1.24 で削除された',
      ],
      src: [S.k8sRuntime],
    },
    cri: {
      name: 'CRI（Container Runtime Interface）',
      def: 'kubelet と、ローカルのコンテナランタイムの間の通信の取り決め。Kubernetes 1.26 以降は、CRI API の v1 にだけ対応する。',
      rel: [],
      src: [S.k8sRuntime],
    },

    /* ---------- 選び方・周辺技術：アプリ別の選び方 ---------- */
    q_linux: {
      name: '判断のポイント：Linux でも動く？',
      def: 'コンテナはホストのカーネルを借りて動くので、アプリが Linux でも動くかどうかが、最初の分かれ目になる。（判断の流れは、筆者の整理です）',
      rel: ['＝ Linux でも動く → Linux コンテナ。Windows 専用 → Windows コンテナ'],
      src: [S.msAbout],
    },
    ps7: {
      name: 'PowerShell 7',
      def: '.NET Core の上に作られた PowerShell。Windows・macOS・Linux で動く（クロスプラットフォーム）。',
      rel: [],
      src: [S.psDiff],
    },
    ps51: {
      name: 'Windows PowerShell 5.1',
      def: '.NET Framework 4.5 の上に作られている。クロスプラットフォームになったのは、PowerShell 6.0 以降。',
      rel: [],
      src: [S.psDiff],
    },
    dotnet: {
      name: '.NET（旧 .NET Core）',
      def: '無料・クロスプラットフォーム・オープンソースの開発プラットフォーム。',
      rel: [],
      src: [S.dotnet],
    },
    dotnet_fw: {
      name: '.NET Framework',
      def: '元祖の .NET。「Windows アプリと Web サービスを作って動かす」ための技術で、Windows と Windows Server の幅広い機能を使える。新規開発では .NET を使うよう案内されている。',
      rel: ['＝ IIS（Internet Information Services）が、そのランタイムをホストできる'],
      src: [S.dotnetFw, S.dotnet],
    },
    db_linux: {
      name: 'DB（PostgreSQL など）',
      def: 'PostgreSQL の公式イメージは、Docker Hub に Windows の記載がない。DB は、Linux コンテナで動かすのが基本になる。（SQL Server の公式コンテナイメージが Linux 向けという点は、公式ページでの確認が未了）',
      rel: [],
      src: [S.hubPg],
    },
    gui_excel: {
      name: 'GUI・Excel 操作のアプリ',
      def: 'コンテナには向かないと、筆者は整理している。そのままの PC、または VM で動かす想定。',
      rel: ['？ 公式ページでは確認できていない（筆者の整理）'],
      src: [],
    },
    pattern_a: {
      name: 'パターン A：Windows コンテナ',
      def: 'Windows 専用のアプリ向け。開発は Windows 11 Pro / Enterprise ＋ Docker Desktop（Windows コンテナ）、本番は Windows Server ＋ Docker Engine。',
      rel: [
        '＝ 公式：Windows 10/11 は Pro / Enterprise ＋ Hyper-V。Windows Server は Moby・Mirantis・containerd',
        '✕ イメージのタグ（ltsc2022 など）は、本番の Windows の版に合わせる',
      ],
      src: [S.msSetup, S.msVer],
    },
    pattern_b: {
      name: 'パターン B：Linux コンテナ',
      def: 'Linux でも動くアプリ向け。開発は WSL 2 ＋ Docker Engine（または Docker Desktop）、本番は Linux サーバーやクラウド。',
      rel: [
        '＝ 公式：Azure の VM は、Linux アプリには Ubuntu のイメージを使う',
        '？ 「Windows Server の Hyper-V 上に Linux VM」「Windows Server に直接 Linux コンテナは載せない」は、筆者の整理（公式ページでの確認はできていない）',
      ],
      src: [S.wsl, S.msAbout],
    },

    dbms: {
      name: 'PostgreSQL',
      def: 'データベースのソフトウェア。db コンテナの中で動いて、データを保存する。',
      rel: [],
      src: [S.hubPg],
    },
  };
})();
