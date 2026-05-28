import { PERSONAL } from '../utils/constants';
import { useScrollRevealMultiple } from '../hooks/useScrollReveal';
import './ResumePreview.css';

export default function ResumePreview() {
  const sectionRef = useScrollRevealMultiple();
  const resumeViewerUrl = `${PERSONAL.resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;

  return (
    <section id="resume" className="section resumePreview" ref={sectionRef}>
      <div className="section-inner">
        <header className="resumePreview__header reveal">
          <span className="section-label">// Resume</span>
          <h2 className="section-title">
            Preview My <span className="gradient-text">Resume</span>
          </h2>
          <p className="section-subtitle">
            You can read my resume directly here without downloading it. Open it in a new tab if you want a larger view.
          </p>
        </header>

        <div className="resumePreview__frame reveal delay-1">
          <div className="resumePreview__toolbar">
            <div>
              <span className="resumePreview__eyebrow">Live preview</span>
              <p className="resumePreview__caption">Embedded PDF resume</p>
            </div>
            <a
              href={PERSONAL.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="resumePreview__link"
            >
              Open in New Tab
            </a>
          </div>

          <div className="resumePreview__viewerShell">
            <iframe
              title="Resume preview"
              src={resumeViewerUrl}
              className="resumePreview__viewer"
            />
          </div>

          <p className="resumePreview__fallback">
            If the PDF preview does not load on your device, use{' '}
            <a href={PERSONAL.resumeUrl} target="_blank" rel="noreferrer">
              this direct link
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
