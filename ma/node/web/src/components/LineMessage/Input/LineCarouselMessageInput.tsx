import {
  InputLabel,
  TextField,
  Button,
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  ClearIcon,
  Select,
  TextArea,
  AddIcon,
} from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '../MessageType';
import { ChangeEvent, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LineCarouselMessageType, {
  MAX_ACTIONS,
  MAX_COLUMNS,
} from '../MessageType/LineCarouselMessageType';
import FormArea from '../../FormArea';
import IconButton from '../../IconButton';
import { useDialog } from '../../AppUtilityProvider/DialogProvider';

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
      label: '',
      uri: '',
    },
  ],
});

type ActionType =
  LineCarouselMessageType['template']['columns'][0]['actions'][0];

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
    columns: [JSON.parse(JSON.stringify(DEFAULT_CAROUSEL_COLUMN))],
  },
});

const ColumnCard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="bg-gray-100 rounded-md">{children}</div>;
};

const ColumnCardHead: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="px-5 py-4 border-b border-b-white flex gap-1 items-center">
      {children}
    </div>
  );
};

const ColumnCardBody: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="px-4 py-2">{children}</div>;
};

const LineCarouselMessageInput: MessageComponent<LineCarouselMessageType> = ({
  messageDetails,
  onChange,
  errors,
}) => {
  const showDialog = useDialog();
  const [altText, setAltText] = useState(messageDetails.altText);
  const [actionNumber, setActionNumber] = useState(
    messageDetails.template.columns[0].actions.length
  );
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
      <FormArea>
        <div className="mb-2">
          <InputLabel required className="mb-2">
            通知のテキスト
          </InputLabel>
          <TextField
            value={altText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange({ newAltText: e.target.value });
            }}
            error={errors?.altText}
          />
          <div className="mb-4" />
          <InputLabel required className="mb-2">
            アクションの数
          </InputLabel>
          <Select
            value={actionNumber}
            onChange={async (e: ChangeEvent<HTMLSelectElement>) => {
              let confirmed = true;
              const newActionNumber = parseInt(e.target.value);
              if (newActionNumber < actionNumber) {
                confirmed = await showDialog({
                  title: 'アクション削除',
                  message: 'アクションの数を減らすと、データが失われます。',
                  confirmText: '削除',
                  variant: 'destructive',
                });
              }
              if (confirmed) {
                setActionNumber(newActionNumber);
                const newColumns = JSON.parse(
                  JSON.stringify(columns)
                ) as typeof columns; // Deep copy
                newColumns.forEach((column) => {
                  column.actions = [];
                  for (let i = 0; i < newActionNumber; i++) {
                    column.actions.push({
                      ...DEFAULT_CAROUSEL_COLUMN.actions[0],
                    });
                  }
                });
                handleChange({ newColumns });
              }
            }}
          >
            {[...Array(MAX_ACTIONS)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Select>
        </div>
      </FormArea>
      <div className="mb-4" />
      <div ref={parent}>
        {columns.map((column, columnIndex) => (
          <div key={column.key}>
            <ColumnCard>
              <ColumnCardHead>
                <div className="font-bold text-xs">
                  {`カード ${columnIndex + 1}`}
                </div>
                <div className="grow" />
                <IconButton
                  onClick={() => {
                    handleMoveColumn(columnIndex, 1);
                  }}
                  disabled={columnIndex >= columns.length - 1}
                >
                  <ArrowDownwardIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleMoveColumn(columnIndex, -1);
                  }}
                  disabled={columnIndex === 0}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  onClick={async () => {
                    if (
                      await showDialog({
                        title: 'メッセージ削除',
                        message: `カード${columnIndex + 1}を削除しますか？`,
                        variant: 'destructive',
                        confirmText: '削除',
                      })
                    ) {
                      const newColumns = JSON.parse(
                        JSON.stringify(columns)
                      ) as typeof columns; // Deep copy
                      newColumns.splice(columnIndex, 1);
                      handleChange({ newColumns });
                    }
                  }}
                  disabled={columns.length === 1}
                >
                  <ClearIcon />
                </IconButton>
              </ColumnCardHead>
              <ColumnCardBody>
                <FormArea>
                  <InputLabel required className="mb-2">
                    タイトル
                  </InputLabel>
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
                  <div className="mb-3" />
                  <InputLabel required className="mb-2">
                    画像
                  </InputLabel>
                  <TextField
                    placeholder="画像URL"
                    value={column.thumbnailImageUrl}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const newColumns = JSON.parse(
                        JSON.stringify(columns)
                      ) as typeof columns; // Deep copy
                      newColumns[columnIndex].thumbnailImageUrl =
                        e.target.value;
                      handleChange({ newColumns });
                    }}
                    error={
                      !!errors?.template?.columns?.[columnIndex]
                        ?.thumbnailImageUrl
                    }
                  />
                  <div className="mb-3" />
                  <InputLabel required className="mb-2">
                    テキスト
                  </InputLabel>
                  <TextArea
                    placeholder="テキストを入力してください"
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
                  <div className="mb-3" />
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
                      newColumns[columnIndex].defaultAction = newActions[0];
                      handleChange({ newColumns });
                    }}
                    errors={errors}
                  />
                </FormArea>
              </ColumnCardBody>
            </ColumnCard>
            <div className="mb-6" />
          </div>
        ))}
        {/* ADD COLUMN BUTTON */}
        <div>
          <Button
            icon={<AddIcon height={16} width={16} />}
            onClick={() => {
              const newColumns = JSON.parse(
                JSON.stringify(columns)
              ) as typeof columns; // Deep copy
              const defaultColumn: ColumnType = {
                ...DEFAULT_CAROUSEL_COLUMN,
                key: Date.now(),
                actions: [...Array(actionNumber)].map(() => ({
                  ...DEFAULT_CAROUSEL_COLUMN.actions[0],
                })),
              };
              newColumns.push(defaultColumn);
              handleChange({ newColumns });
            }}
            disabled={messageDetails.template.columns.length >= MAX_COLUMNS}
          >
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
}> = ({ columnIndex, actions, onChange, errors }) => {
  return (
    <div>
      <InputLabel required className="mb-2">
        アクション
      </InputLabel>
      {actions.map((action, actionIndex) => (
        <div key={actionIndex} className="max-w-md my-2">
          {/* ACTION INPUTS */}
          <TextField
            placeholder="アクションラベル"
            value={action.label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newActions = JSON.parse(
                JSON.stringify(actions)
              ) as typeof actions; // Deep copy
              newActions[actionIndex].label = e.target.value;
              onChange(newActions);
            }}
            error={
              !!errors?.template?.columns?.[columnIndex]?.actions?.[actionIndex]
                ?.label
            }
          />
          <div className="mb-2" />
          <TextField
            placeholder="アクション先URL"
            value={action.uri}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newActions = JSON.parse(
                JSON.stringify(actions)
              ) as typeof actions; // Deep copy
              newActions[actionIndex].uri = e.target.value;
              onChange(newActions);
            }}
            error={
              !!errors?.template?.columns?.[columnIndex]?.actions?.[actionIndex]
                ?.uri
            }
          />
          {actionIndex < actions.length - 1 && (
            <hr className="mt-2 border-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};

export default LineCarouselMessageInput;
