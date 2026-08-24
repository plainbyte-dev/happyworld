function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand-mark ${inverse ? 'brand-mark-inverse' : ''}`} aria-hidden="true">
      <span className="brand-mark-top">H</span><span className="brand-mark-bottom">T</span>
    </span>
  );
}

export default BrandMark;
