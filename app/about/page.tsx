import type { Metadata } from 'next'
import Image from 'next/image'
import PageContainer from '@/components/PageContainer'
import { CONTENT_FRAME_CLASS, INTRO_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import ContentCarousel from '@/components/ContentCarousel'
import { getContentByType } from '@/lib/content'

export const metadata: Metadata = {
  title: "About - Andreas Juon",
  description:
    "About Andreas Juon - Researcher in Conflict & Security | Data Analytics | Consulting",
};

export default function AboutPage() {
  const projectItems = getContentByType('project')
  const datasetItems = getContentByType('dataset')

  return (
    <PageContainer>
      <div className="mb-12">
        {/* Top horizontal intro frame with portrait, heading, and intro text */}
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden">
                <Image
                  src="/images/portrait2.jpeg"
                  alt="Portrait of Andreas Juon"
                  fill
                  className="object-cover object-[50%_25%] transform scale-150 translate-y-12 -translate-x-6"
                  sizes="(max-width: 768px) 224px, 256px"
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About
              </h1>
              <p className="text-lg text-gray-700">
                I am a quantitative political scientist. Currently, I am a
                researcher at University of Fribourg, financed by an SNSF
                Ambizione grant. I am also associated in continuing
                collaboration with the International Conflict Research Group at
                ETH Zurich. I obtained my PhD from University College London in
                2020. In 2021, my dissertation was awarded the ECPR Jean Blondel
                Prize (best dissertation in politics). I am currently pursuing a
                second master&apos;s degree in analytics/data science from
                Georgia Tech, which supports my work in data engineering,
                large-scale data integration, and applied statistical modeling.
                I also hold an MA degree in Comparative and International
                Studies from ETH Zurich and a BSc degree in Geography and
                Chinese from University of Zurich.
              </p>
            </div>
          </div>
        </div>

        {/* Three-column section: Research, Data & Methods, Consulting */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Research block */}
          <div className={INTRO_FRAME_CLASS}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Research
            </h2>
            {projectItems.length > 0 && (
              <div className="mb-4">
                <ContentCarousel items={projectItems} itemsPerView={1} />
              </div>
            )}
            <p className="text-lg text-gray-700 mb-4">
              My research examines how identity politics and institutional
              design shape violent conflict, democratic stability, and
              geopolitical risk. My ongoing work focuses on two major sources of
              instability in contemporary world politics: the management of
              identity-based conflict within states and the rise of exclusionary
              nationalism with implications for regional order and geopolitics.
            </p>
            <p className="text-lg text-gray-700">
              Across my research, I evaluate policies that are widely used to
              stabilize divided societies — such as constitutional
              power-sharing, decentralization, and multicultural governance —
              examining both their intended effects and their unintended
              consequences. This work speaks directly to core questions in
              international relations and conflict research: how domestic
              institutions affect internal security and democratic quality, how
              nationalist ideologies travel across borders, and how identity
              politics interacts with geopolitical competition.
            </p>
          </div>

          {/* Data and Methods block */}
          <div className={INTRO_FRAME_CLASS}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data and Methods
            </h2>
            {datasetItems.length > 0 && (
              <div className="mb-4">
                <ContentCarousel items={datasetItems} itemsPerView={1} />
              </div>
            )}
            <p className="text-lg text-gray-700 mb-4">
              A central contribution of my research is the development of new
              global datasets on nationalism, institutions, and conflict. These
              include data on constitutional power-sharing arrangements,
              regional autonomy, nationalist movements, administrative
              boundaries, and ethnically disaggregated public opinion. Together,
              these resources enable systematic cross-national analysis of
              political instability and security risks.
            </p>
            <p className="text-lg text-gray-700">
              Methodologically, I specialize in quantitative causal inference
              using large-N observational data, including fixed-effects designs,
              instrumental variables, and staggered difference-in-differences. I
              complement these approaches with survey analysis and case-based
              process tracing. Alongside my PhD in political science, I hold a
              second master’s degree in analytics/data science, which supports
              my work in data engineering, large-scale data integration, and
              applied statistical modeling.
            </p>
          </div>

          {/* Consulting block */}
          <div className={`${INTRO_FRAME_CLASS} md:col-span-2 lg:col-span-1`}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Consulting
            </h2>
            <div className="mb-4">
              {/* Match ContentTile total height: 16/9 image area + 15rem text block */}
              <div className="relative w-full h-[27rem]">
                <Image
                  src="/images/talks/talk_barcelona_crop.jpeg"
                  alt="Symbolic consulting illustration"
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              Beyond academia, I work with public-sector organizations, NGOs,
              and private firms that need rigorous analysis of political and
              security risk. My consulting focuses on:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-4">
              <li>Political risk assessment and forecasting</li>
              <li>Conflict and instability analysis</li>
              <li>Institutional design and peacebuilding evaluation</li>
              <li>Regional autonomy and center–periphery relations</li>
              <li>Nationalism and geopolitical risk</li>
            </ul>
            <p className="text-lg text-gray-700">
              My work combines substantive expertise in conflict and nationalism
              with advanced data analysis and modeling skills, allowing
              organizations to make evidence-based decisions in complex
              political environments. If you are interested in collaboration,
              consulting, or invited talks, please get in touch.
            </p>
          </div>
        </div>

        {/* Curriculum Vitae block */}
        <div className={CONTENT_FRAME_CLASS}>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Curriculum Vitae
          </h2>
          <p className="text-gray-700">
            [CV content will be embedded here. You can add a link to download
            your CV or embed it directly.]
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
