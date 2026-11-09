Palette Town | 性能カスタムの並び順 修正版

変更するファイル：shared-ui.js のみ
Parts Guideの guide.html は指定の並び順になっていることを確認済みです。

変更内容：Mechanic Deskの性能カスタム欄を次の順に統一します。
  オイルポンプ → ドライブシャフト → シリンダーヘッド →
  バッテリーケーブル → 燃料タンク

実装：追加したshared-ui.jsは、既存script.jsの実行後に、画面上の行を
入れ替えます。DOMノードを移動する方式なので、チェック状態、
フルカス、価格・割引計算、全修理は変えません。
既存のHTMLやscript.jsを古いものへ差し替える必要はありません。

GitHubのA1リポジトリで、shared-ui.jsだけを上書き→Commit changes。
ページ公開後、Ctrl + Shift + Rでキャッシュを更新。

同梱guide.htmlは参照用（現在の並び順を確認済み）。
guide.htmlは変更されていないため、原則アップロード不要です。

もし今のshared-ui.jsに別の変更を加えている場合は、上書きせず
修正版末尾のDOMContentLoaded処理だけ追記してください。
