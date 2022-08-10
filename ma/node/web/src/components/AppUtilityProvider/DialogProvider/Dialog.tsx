import { Button } from '@super_studio/ecforce_ui_albers';

const Dialog: React.FC<{
  title: string;
  body?: React.ReactNode;
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  noCancelButton?: boolean;
}> = ({ title, body, open, onConfirm, onCancel, noCancelButton }) => {
  return open ? (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={onCancel}
      >
        <div
          className="relative w-auto my-6 mx-auto max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onCancel}
              >
                <span className="bg-transparent text-black opacity-20 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            {body && (
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-slate-500 text-lg leading-relaxed whitespace-pre-wrap">
                  {body}
                </p>
              </div>
            )}
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              {!noCancelButton && (
                <Button onClick={onCancel}>キャンセル</Button>
              )}
              <div className="mr-2" />
              <Button variant="primary" onClick={onConfirm}>
                確認
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="opacity-25 fixed inset-0 z-40 bg-black"
        onClick={onCancel}
      ></div>
    </>
  ) : null;
};

export default Dialog;
