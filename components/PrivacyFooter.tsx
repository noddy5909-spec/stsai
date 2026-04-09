export function PrivacyFooter() {
  return (
    <footer className="border-t border-slate-300 bg-portal-surface px-4 py-4 text-center text-xs text-slate-600 sm:px-6">
      <p className="w-full leading-relaxed">
        <span className="font-semibold text-[#003876]">
          이 데이터는 브라우저 내부에서 암호화되어 처리됩니다.
        </span>{" "}
        본 프로토타입의 개인정보는 목업이며 실제 연동·전송을 수행하지 않습니다.
      </p>
    </footer>
  );
}
