# BytePlus ModelArk セットアップガイド

## 概要
このアプリケーションは、BytePlus ModelArkのDoubaoモデルを使用してAIコーチング機能を提供します。

## 必要な設定

### 1. BytePlus ModelArkアカウントの準備
- BytePlusアカウントを作成し、ModelArkサービスにアクセスしてください
- APIキーを取得してください

### 2. 推論エンドポイントの作成
BytePlus ModelArkコンソールで推論エンドポイントを作成する必要があります：

1. BytePlus ModelArkコンソールにログイン
2. 「推論エンドポイント」セクションに移動
3. 新しいエンドポイントを作成
4. Doubaoモデル（doubao-lite-4k または doubao-pro-4k）を選択
5. エンドポイントIDをコピー（形式: `ep-xxxxxxxxxx-xxxx`）

### 3. 環境変数の設定
`.env`ファイルで以下の変数を設定してください：

```env
# BytePlus ModelArk API Configuration
BYTEPLUS_API_KEY=your-api-key-here
BYTEPLUS_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
BYTEPLUS_MODEL_ENDPOINT=your-endpoint-id-here
```

### 4. 設定例
```env
# BytePlus ModelArk API Configuration
BYTEPLUS_API_KEY=ed956076-bf13-4213-a85f-0230e6e6cfce
BYTEPLUS_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
BYTEPLUS_MODEL_ENDPOINT=ep-20241025161000-xxxxx
```

## トラブルシューティング

### エラー: "The model or endpoint does not exist"
- エンドポイントIDが正しく設定されているか確認してください
- BytePlusコンソールでエンドポイントが正常に作成されているか確認してください
- APIキーに適切な権限があるか確認してください

### エラー: "API Key authentication failed"
- APIキーが正しく設定されているか確認してください
- APIキーの有効期限が切れていないか確認してください

## 参考リンク
- [BytePlus ModelArk ドキュメント](https://docs.byteplus.com/en/docs/ModelArk)
- [OpenAI API互換性ガイド](https://docs.byteplus.com/api/docs/ModelArk/1330626)