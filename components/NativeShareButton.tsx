import styled from "styled-components";

const NativeShareIcon = () => (
  <svg width="64" height="64" viewBox="-4 -4 38 38">
    <rect x="-10" y="-10" width="64" height="64" fill={"#ccc"} />
    <path d="M4.01 10.99C1.795 10.99 0 12.786 0 15c0 2.215 1.795 4.01 4.01 4.01S8.02 17.215 8.02 15c0-2.214-1.795-4.01-4.01-4.01zm0 6.239c-1.229 0-2.228-1-2.228-2.229s.999-2.228 2.228-2.228 2.228.999 2.228 2.228-1 2.229-2.228 2.229zM15 10.99c-2.215 0-4.01 1.795-4.01 4.01s1.795 4.01 4.01 4.01 4.01-1.795 4.01-4.01c0-2.214-1.795-4.01-4.01-4.01zm0 6.239c-1.229 0-2.228-1-2.228-2.229s.999-2.228 2.228-2.228 2.229.999 2.229 2.228-1 2.229-2.229 2.229zM25.99 10.99c-2.215 0-4.01 1.795-4.01 4.01s1.795 4.01 4.01 4.01S30 17.215 30 15c0-2.214-1.795-4.01-4.01-4.01zm0 6.239c-1.229 0-2.227-1-2.227-2.229s.998-2.228 2.227-2.228 2.228.999 2.228 2.228-1 2.229-2.228 2.229z" />
  </svg>
);

const NoStyleButton = styled.button`
  border: none;
  padding: 0;
  cursor: pointer;
`;

export function NativeShareButton({
  url,
  text,
}: {
  url: string;
  text: string;
}) {
  if (!navigator.share) return null;
  if (!navigator.canShare({ url, text })) return null;
  return (
    <NoStyleButton
      onClick={() => {
        navigator.share({ url, text });
      }}
    >
      <NativeShareIcon />
    </NoStyleButton>
  );
}
