import { InputLabel, TextField, Button } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent, useState } from 'react';
import {
  MdAdd,
  MdArrowDropDown,
  MdArrowDropUp,
  MdDelete,
} from 'react-icons/md';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LineCarouselMessageType, {
  MAX_ACTIONS,
  MAX_COLUMNS,
} from '../MessageType/LineCarouselMessageType';

const DEFAULT_CAROUSEL_COLUMN = Object.freeze<
  LineCarouselMessageType['template']['columns'][0]
>({
  thumbnailImageUrl: '',
  title: '',
  text: '',
  defaultAction: {
    type: 'uri',
    label: 'Link',
    uri: '',
  },
  actions: [
    {
      type: 'uri',
      label: '詳細を見る',
      uri: '',
    },
  ],
});

type ActionType =
  LineCarouselMessageType['template']['columns'][0]['actions'][0] & {
    key: number;
  };

type ColumnType = Omit<
  LineCarouselMessageType['template']['columns'][0],
  'actions'
> & {
  key: number;
  actions: ActionType[];
};

export const DEFAULT_CAROUSEL_MESSAGE = Object.freeze<LineCarouselMessageType>({
  type: 'template',
  altText: '',
  template: {
    type: 'carousel',
    columns: [
      JSON.parse(JSON.stringify(DEFAULT_CAROUSEL_COLUMN)),
      JSON.parse(JSON.stringify(DEFAULT_CAROUSEL_COLUMN)),
    ],
  },
});

const LineCarouselMessageInput: MessageComponent<LineCarouselMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
  const [altText, setAltText] = useState(messageDetails.altText);
  const [columns, setColumns] = useState<ColumnType[]>(
    messageDetails.template.columns.map((column, index) => {
      return {
        ...column,
        key: index,
        actions: column.actions.map((action, index) => ({
          ...action,
          key: index,
        })),
      };
    })
  );
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const handleChange = (input: {
    newColumns?: ColumnType[];
    newAltText?: string;
  }) => {
    const newColumns = input.newColumns || columns;
    const newAltText = input.newAltText || altText;
    setColumns(newColumns);
    setAltText(newAltText);
    onChange &&
      onChange({
        ...messageDetails,
        altText: newAltText,
        template: {
          ...messageDetails.template,
          columns: newColumns.map((column) => {
            const parsedColumn = JSON.parse(JSON.stringify(column));
            delete parsedColumn.key;
            parsedColumn.actions.forEach((action: any) => {
              delete action.key;
            });
            return parsedColumn as LineCarouselMessageType['template']['columns'][0];
          }),
        },
      });
  };

  const handleMoveAction = (
    columnIndex: number,
    actionIndex: number,
    shift: 1 | -1
  ) => {
    const newColumns = JSON.parse(JSON.stringify(columns)) as typeof columns; // Deep copy
    newColumns[columnIndex].actions[actionIndex] = {
      ...columns[columnIndex].actions[actionIndex + shift],
    };
    newColumns[columnIndex].actions[actionIndex + shift] = {
      ...columns[columnIndex].actions[actionIndex],
    };
    handleChange({ newColumns });
  };

  const handleMoveColumn = (columnIndex: number, shift: 1 | -1) => {
    const newColumns = JSON.parse(JSON.stringify(columns)) as typeof columns; // Deep copy
    newColumns[columnIndex] = {
      ...columns[columnIndex + shift],
    };
    newColumns[columnIndex + shift] = {
      ...columns[columnIndex],
    };
    handleChange({ newColumns });
  };

  return (
    <>
      <div className="mb-2">
        <InputLabel>通知のテキスト</InputLabel>
        <TextField
          value={altText}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleChange({ newAltText: e.target.value });
          }}
          error={errors?.altText}
        />
      </div>
      <div ref={parent}>
        {columns.map((column, columnIndex) => (
          <div
            key={column.key}
            className="border-l-4 border-b-4 border-gray-200 pl-4 max-w-xl mb-2"
          >
            <div className="my-1">
              {/* COLUMN HEADER */}
              <div className="flex gap-1 items-center">
                <div className="font-bold text-xs">
                  {`カラム #${columnIndex + 1}`}
                </div>
                <div className="grow" />
                <Button
                  icon
                  onClick={() => {
                    handleMoveColumn(columnIndex, 1);
                  }}
                  disabled={columnIndex >= columns.length - 1}
                >
                  <MdArrowDropDown />
                </Button>
                <Button
                  icon
                  onClick={() => {
                    handleMoveColumn(columnIndex, -1);
                  }}
                  disabled={columnIndex === 0}
                >
                  <MdArrowDropUp />
                </Button>
                <Button
                  icon
                  variant="destructive"
                  onClick={() => {
                    const newColumns = JSON.parse(
                      JSON.stringify(columns)
                    ) as typeof columns; // Deep copy
                    newColumns.splice(columnIndex, 1);
                    handleChange({ newColumns });
                  }}
                  disabled={columns.length === 1}
                >
                  <MdDelete />
                </Button>
              </div>
              {/* COLUMN INPUTS */}
              <InputLabel>画像URL</InputLabel>
              <TextField
                value={column.thumbnailImageUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newColumns = JSON.parse(
                    JSON.stringify(columns)
                  ) as typeof columns; // Deep copy
                  newColumns[columnIndex].thumbnailImageUrl = e.target.value;
                  handleChange({ newColumns });
                }}
                error={
                  !!errors?.template?.columns?.[columnIndex]?.thumbnailImageUrl
                }
              />
              <InputLabel>タイトル</InputLabel>
              <TextField
                value={column.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newColumns = JSON.parse(
                    JSON.stringify(columns)
                  ) as typeof columns; // Deep copy
                  newColumns[columnIndex].title = e.target.value;
                  handleChange({ newColumns });
                }}
                error={!!errors?.template?.columns?.[columnIndex]?.title}
              />
              <InputLabel>詳細</InputLabel>
              <TextField
                value={column.text}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newColumns = JSON.parse(
                    JSON.stringify(columns)
                  ) as typeof columns; // Deep copy
                  newColumns[columnIndex].text = e.target.value;
                  handleChange({ newColumns });
                }}
                error={!!errors?.template?.columns?.[columnIndex]?.text}
              />
              <InputLabel>デフォルトURL</InputLabel>
              <TextField
                value={column.defaultAction.uri}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newColumns = JSON.parse(
                    JSON.stringify(columns)
                  ) as typeof columns; // Deep copy
                  newColumns[columnIndex].defaultAction.uri = e.target.value;
                  handleChange({ newColumns });
                }}
                error={
                  !!errors?.template?.columns?.[columnIndex]?.defaultAction?.uri
                }
              />
              {/* ACTIONS */}
              <Actions
                actions={column.actions}
                columnIndex={columnIndex}
                onMoveAction={(columnIndex, actionIndex, shift) => {
                  handleMoveAction(columnIndex, actionIndex, shift);
                }}
                onChange={(newActions: ActionType[]) => {
                  const newColumns = JSON.parse(
                    JSON.stringify(columns)
                  ) as typeof columns; // Deep copy
                  newColumns[columnIndex].actions = newActions;
                  handleChange({ newColumns });
                }}
                errors={errors}
              />
            </div>
          </div>
        ))}
        {/* ADD COLUMN BUTTON */}
        <div>
          <Button
            onClick={() => {
              const newColumns = JSON.parse(
                JSON.stringify(columns)
              ) as typeof columns; // Deep copy
              const defaultColumn: ColumnType = {
                ...DEFAULT_CAROUSEL_COLUMN,
                key: Date.now(),
                actions: DEFAULT_CAROUSEL_COLUMN.actions.map((action) => ({
                  ...action,
                  key: Date.now(),
                })),
              };
              newColumns.push(defaultColumn);
              handleChange({ newColumns });
            }}
            disabled={messageDetails.template.columns.length >= MAX_COLUMNS}
          >
            <MdAdd />
            カラム追加
          </Button>
        </div>
      </div>
    </>
  );
};

/**
 * １つのカルーセルカラムのアクションリスト
 */
const Actions: React.FC<{
  columnIndex: number;
  actions: ActionType[];
  onMoveAction: (
    columnIndex: number,
    actionIndex: number,
    shift: 1 | -1
  ) => void;
  onChange: (newActions: ActionType[]) => void;
  errors?: Partial<LineCarouselMessageType>;
}> = ({ columnIndex, actions, onMoveAction, onChange, errors }) => {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  return (
    <div ref={parent}>
      {actions.map((action, actionIndex) => (
        <div
          key={action.key}
          className="border-l-4 border-b-4 border-gray-200 pl-4 max-w-md my-2"
        >
          <div className="my-1">
            {/* ACTION HEADER */}
            <div className="flex gap-1 items-center">
              <div className="font-bold text-xs">
                {`アクション #${actionIndex + 1}`}
              </div>
              <div className="grow" />
              <Button
                icon
                onClick={() => {
                  onMoveAction(columnIndex, actionIndex, 1);
                }}
                disabled={actionIndex >= actions.length - 1}
              >
                <MdArrowDropDown />
              </Button>
              <Button
                icon
                onClick={() => {
                  onMoveAction(columnIndex, actionIndex, -1);
                }}
                disabled={actionIndex === 0}
              >
                <MdArrowDropUp />
              </Button>
              <Button
                icon
                variant="destructive"
                onClick={() => {
                  const newActions = JSON.parse(
                    JSON.stringify(actions)
                  ) as typeof actions; // Deep copy
                  newActions.splice(actionIndex, 1);
                  onChange(newActions);
                }}
                disabled={actions.length === 1}
              >
                <MdDelete />
              </Button>
            </div>
            {/* ACTION INPUTS */}
            <InputLabel>ラベル</InputLabel>
            <TextField
              value={action.label}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newActions = JSON.parse(
                  JSON.stringify(actions)
                ) as typeof actions; // Deep copy
                newActions[actionIndex].label = e.target.value;
                onChange(newActions);
              }}
              error={
                !!errors?.template?.columns?.[columnIndex]?.actions?.[
                  actionIndex
                ]?.label
              }
            />
            <InputLabel>URL</InputLabel>
            <TextField
              value={action.uri}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newActions = JSON.parse(
                  JSON.stringify(actions)
                ) as typeof actions; // Deep copy
                newActions[actionIndex].uri = e.target.value;
                onChange(newActions);
              }}
              error={
                !!errors?.template?.columns?.[columnIndex]?.actions?.[
                  actionIndex
                ]?.uri
              }
            />
          </div>
        </div>
      ))}
      {/* ADD ACTION BUTTON */}
      <div>
        <Button
          onClick={() => {
            const newActions = JSON.parse(
              JSON.stringify(actions)
            ) as typeof actions; // Deep copy
            newActions.push({
              ...DEFAULT_CAROUSEL_COLUMN.actions[0],
              key: Date.now(),
            });
            onChange(newActions);
          }}
          disabled={actions.length >= MAX_ACTIONS}
        >
          <MdAdd />
          アクション追加
        </Button>
      </div>
    </div>
  );
};

export default LineCarouselMessageInput;
