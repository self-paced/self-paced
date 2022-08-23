import { MessageComponent } from '../.';
import message from '../../../../../sls/src/functions/trpc/routers/message';

type DefaultAction = {
  label: string;
  type: string;
  uri: string;
};

type Action = {
  label: string;
  type: string;
  uri: string;
};

type Column = {
  title: string;
  text: string;
  thumbnailImageUrl: string;
  actions: Action[];
  defaultAction: DefaultAction;
};

type Template = {
  type: string;
  columns: Column[];
};

export type Carousel = {
  altText: string;
  type: string;
  template: Template;
};

export const DEFAULT_CAROUSEL_MESSAGE = Object.freeze<Carousel>({
  type: 'template',
  altText: '',
  template: {
    type: '',
    columns: [],
  },
});

const LineMessage: MessageComponent<Carousel> = ({ messageDetails }) => {
  console.log(messageDetails);
  return (
    <div>
      <dl className="grid grid-cols-2">
        <dt className="w-36">メッセージタイプ</dt>
        <dd>{messageDetails.type}</dd>
        <dt>Alt</dt>
        <dd>{messageDetails.altText}</dd>
        <dt>メッセージ</dt>
        <dd>
          {messageDetails.template.columns.map((column, columnIndex) => {
            return (
              <div key={columnIndex}>
                <dl>
                  <dt>タイトル</dt>
                  <dd>{column.title}</dd>
                  <dt>サムネイル画像</dt>
                  <dd>
                    <div className="w-24 h-24">
                      <img
                        src={column.thumbnailImageUrl}
                        alt={column.thumbnailImageUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </dd>
                  <dt>デフォルトアクション</dt>
                  <dd>
                    {column.defaultAction.label} {column.defaultAction.uri}
                  </dd>
                  <dt>アクション</dt>
                  <dd>
                    <Actions actions={column.actions} />
                  </dd>
                </dl>
              </div>
            );
          })}
        </dd>
      </dl>
    </div>
  );
};

const Actions: React.FC<{
  actions: Action[];
}> = ({ actions }) => {
  return (
    <div>
      {actions.map((action, actionIndex) => {
        return (
          <div key={actionIndex}>
            {action.label} {action.uri}
          </div>
        );
      })}
    </div>
  );
};

export default LineMessage;
