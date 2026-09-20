# ラシティメカニック 請求計算

シンプルな料金計算Webアプリです。

## GitHub Pagesで公開

1. GitHubで新しいRepositoryを作成
2. `index.html`、`style.css`、`script.js`をアップロード
3. Repositoryの **Settings → Pages**
4. Sourceを **Deploy from a branch**
5. Branchを `main` / `/ (root)` にしてSave
6. 数分待つと公開URLが表示されます。

## 料金

入力された料金表をJavaScriptに登録しています。
料金を変更する場合は `script.js` の `tierData` または `index.html` の `data-price` を変更してください。
