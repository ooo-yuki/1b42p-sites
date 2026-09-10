/* Реклама AADS — один блок внизу каждой страницы. */
export default function Ads(): JSX.Element {
  return (
    <div id="frame" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', margin: '12px auto', position: 'relative', zIndex: 99998 }}>
      <iframe data-aa="2454848" title="Реклама" src="//acceptable.a-ads.com/2454848/?size=Adaptive"
        style={{ border: 0, padding: 0, width: '70%', maxWidth: '100%', height: 'auto', overflow: 'hidden', display: 'block', margin: 'auto' }} />
      <div style={{ width: '70%', margin: 'auto', position: 'absolute', left: 0, right: 0 }}>
        <a target="_blank" rel="noopener noreferrer" id="frame-link"
          style={{ display: 'inline-block', fontSize: 13, color: '#263238', padding: '4px 10px', background: '#F8F8F9', textDecoration: 'none', borderRadius: '0 0 4px 4px' }}
          href="https://aads.com/campaigns/new/?source_id=2454848&source_type=ad_unit&partner=2454848">Advertise here</a>
      </div>
    </div>
  );
}
