%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Deedy - One Page Two Column Resume
    % LaTeX Template
        % Version 1.2(16 / 9 / 2014)
            %
% Original author:
% Debarghya Das(http://debarghyadas.com)
%
% Original repository:
% https://github.com/deedydas/Deedy-Resume
%
% IMPORTANT: THIS TEMPLATE NEEDS TO BE COMPILED WITH XeLaTeX
            %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

                \documentclass[]{ deedy- resume - openfont}
                \usepackage{ fancyhdr }
                \usepackage{ xcolor }
                \usepackage{ geometry }

            % OPTIMIZATION 1: Expand margins to give the page more breathing room
                \geometry{ a4paper, left=1cm, top=1.2cm, right=1cm, bottom=1.2cm }

            % OPTIMIZATION 2: Reduce section spacing globally
                \renewcommand{ \sectionsep }{ \vspace{ 3pt }}

% OPTIMIZATION 3: Fix the overlap bug! Replaced the unpredictable -\topsep with a fixed - 4pt space.
% Also tightened itemsep to easily fit one page and slightly increased font size for readability.
\renewenvironment{ tightemize } {
    \vspace{ -4pt }
    \begin{ itemize }
    \fontsize{ 9.5pt } { 11.5pt } \selectfont
    \itemsep0pt \parskip0pt \parsep0pt
} {
    \end{ itemize }
}

\pagestyle{ fancy }
\fancyhf{ }

\begin{ document }

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% TITLE NAME
    %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\namesection{ Priyanshu } { Chauhan } {
\urlstyle{ same } \href{
    http://iamstackless.com}{iamstackless.com} | \href{https://www.linkedin.com/in/priyanshu--chauhan/}{LinkedIn} | \href{https://github.com/Priyanshu-C}{GitHub} | \href{https://iamstackless.medium.com/}{Medium}\\
    \href{ mailto: priyanshuc.info@gmail.com } { priyanshuc.info@gmail.com } | \href{ tel: +918127112133 } { +91 8127112133 }
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% COLUMN ONE
        %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    \begin{ minipage } [t]{ 0.33\textwidth }

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% EDUCATION
        %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    \section{ Education }
    \vspace{ 6pt }
    \subsection{SRM University }
    \descript{ B.Tech in Information Technology }
    \location{ GPA: 85.50\%}
    \location{July 2016 - July 2020 | Chennai, India }

    \sectionsep

    \subsection{CMS Gomti Nagar Campus }
Higher Secondary School \\
    \location{ 93.25\%}
    \location{March 2015 - March 2016 | Lucknow, India }

    \sectionsep

    \subsection{CMS Mahanagar Campus }
High School
    \location{ 91.40\%}
    \location{March 2013 - March 2014 | Lucknow, India }

    \sectionsep

        %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% SKILLS
        %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    \section{ Skills }
    \vspace{ 6pt }
    \subsection{ Programming }
    JavaScript \textbullet{ } C++ \textbullet{ } TypeScript \\
    Python \textbullet{ } MySQL \textbullet{ } HTML \\
    CSS

    \sectionsep

    \subsection{ Tools \& Database }
    Git \textbullet{ } Docker \textbullet{ } Kubernetes \textbullet{ } OpenAI\\
    AWS \textbullet{ } GraphQL \textbullet{ } MongoDB \textbullet{ } Supabase

    \sectionsep

    \subsection{ Framework \& Library }
    ReactJS \textbullet{ } NextJS \textbullet{ } Django \textbullet{ } Redux Toolkit \textbullet{ }
Rest Framework \textbullet{ } Redux \textbullet{ } Terraform \textbullet{ } ExpressJS \textbullet{ }
REST API \textbullet{ } GraphQL \textbullet{ } DrizzleORM \textbullet{ } Flask

    \sectionsep

    \subsection{Soft Skills }
Deliver Results \textbullet{ } Adaptability \textbullet{ } Problem - solving \textbullet{ } Leadership \textbullet{ } Agility \textbullet{ } Timeline - adherence

    \sectionsep

        %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% AWARDS & ACHIEVEMENTS
        %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    \section{ Awards \& Achievements }
    \vspace{ 6pt }
    \textbf{ FY2024 } MVP Nominee \textbullet{ } \textbf{ FY2023 } Annual Award Recipient \\
    \textbullet{ } Jury Award in Razorpay Hackathon
    \textbullet{ } \href{
        https://media.licdn.com/dms/image/D562DAQHWB4dR3cfceQ/profile-treasury-image-shrink_800_800/0/1692680954666?e=1718650800&v=beta&t=lPcJt5h3AakEGDqlfOYEzZT8L784DUuwLZIJMU8GQ50}{Spot Awards for NFTbyRazorpayX}  \textbullet{} \href{https://media.licdn.com/dms/image/D562DAQFQ3cipfaEw6Q/profile-treasury-image-shrink_800_800/0/1692680865145?e=1718650800&v=beta&t=NB3R0E3JGOix8ss5f1sw6eWG2rLH5MjIyeHndwyGd5g}{FE Core Rewind Award} \textbullet{} \href{https://media.licdn.com/dms/image/D562DAQEO4EcUhnqYJQ/profile-treasury-image-shrink_480_480/0/1718044318936?e=1718650800&v=beta&t=1IPX6X1MXHL2Ejh68XzNo5oH33abzGCfmzNZohlwYLg}{Spot Award for RazorpayX VKYC} \textbullet{} Machine Learning by DataCamp

        \end{ minipage }
        \hfill
        \begin{ minipage } [t]{ 0.66\textwidth }

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% EXPERIENCE
            %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        \section{Work Experience }
        \vspace{ 6pt }
        \runsubsection{
        \href{
            https://coinbase.com/}{Coinbase}} \\[2pt]
            \descript{Software Engineer IC4, Platform }
            \location{September 2024 - Present | Remote, India }
            \vspace{ 10pt }
            \begin{ tightemize }
            \item \textbf{Architected modular onboarding:} Developed a \textbf{ plug - and - play onboarding flow } adopted across multiple Coinbase products, currently scaling to support users in \textbf{ 80 + countries }.
            \item \textbf{Led core vendor migration:} Spearheaded a \textbf{ company - wide vendor migration } for the core \textbf{ID verification } infrastructure utilized across the entire Coinbase platform.
            \item \textbf{Improved deployment stability:} Engineered an internal \textbf{ end - to - end(E2E) testing } workflow that successfully intercepted and mitigated defects in the development environment prior to production releases.
            \item \textbf{Drove compliance initiatives:} Executed multiple time - critical compliance projects with \textbf{ 100\% on - time delivery }.
            \item \textbf{Optimized design systems:} Partnered with cross - functional design teams to enhance and scale the \textbf{
            \href{
                https://cds.coinbase.com/}{Coinbase Design System}}.
                \end{ tightemize }
                \sectionsep

                \runsubsection{ Razorpay } \\[2pt]
                \descript{Senior Frontend Engineer, Platform }
                \location{May 2021 - Present | Bangalore, India }
                \begin{ tightemize }
                \item \textbf{Architected unified authentication:} Co - developed an authentication service scaling to \textbf{ 1M + monthly merchants } across \textbf{ India } and \textbf{ Malaysia }; decoupled the API layer and integrated \textbf{Module Federation } for flexibility. [\textbf{ GraphQL }, \textbf{ Next.js } \& \textbf{ AWS }](\href{
                    https://accounts.razorpay.com/}{\textbf{LINK}})
                    \item \textbf{Optimized performance \& scalability: } Built an in -house \textbf{ i18n } solution to keep bundle sizes minimal across cross - border applications.
                    \item \textbf{Scaled design system architecture:} Engineered core \textbf{ multi - currency components } for the Blade Design System, driving uniform cross - border UX across all Razorpay apps. (\textbf{ \href{
                        https://blade.razorpay.com/}{LINK}})
                        \item \textbf{ Drove AI- led developer experience:} Led architecture and deployment of \textbf{ R.A.Y }, an AI support chatbot using \textbf{ RAG } over \textbf{ vector - embedded } docs, cutting support tickets by \textbf{ 11\%}.[\textbf{ OpenAI }, \textbf{ Next.js }, \textbf{ Kubernetes }, \textbf{ Terraform } \& \textbf{ AWS }](\href{
                            https://razorpay.com/docs/#home-payments}{\textbf{LINK}} | \href{https://razorpay.com/blog/docs-ai-your-ultimate-guide-to-razorpay/}{\textbf{Blog}})
                            \item \textbf{ Accelerated time- to - market:} Spearheaded a \textbf{Framer migration } with \textbf{ A / B testing } and behavior analytics, cutting page - creation TAT by \textbf{ 85\%} (7 days to 1).[\textbf{ AWS } \& \textbf{ Segment }](\href{
                                https://www.framer.com/}{\textbf{LINK}})
                                \item \textbf{ Improved product conversion:} Built a dashboard \textbf{ Demo Mode } that lifted \textbf{ MTU conversion by 6\%}.(\href{
                                    https://x.razorpay.com/demo}{\textbf{LINK}})
                \item \textbf{Established engineering standards:} Standardized \textbf{E2E testing }, audit pipelines, and \textbf{ CI / CD checks } for the Capital Business Unit; trained teams on adoption. [\textbf{ Jest }, \textbf{ Playwright } \& \textbf{ Kubernetes }]
                \end{ tightemize }
                \sectionsep

                    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PERSONAL PROJECTS
                    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

                \section{Personal Projects }

                \runsubsection{ MENTORFLOW } \\[2pt]
                \descript{ AI - native mentorship platform, NextJS + Supabase + Claude }
                \begin{ tightemize }
                \item \textbf{AI session intelligence:} Built a \textbf{ Whisper } + \textbf{ Claude } pipeline that auto - generates session summaries, action items, and goal updates from call recordings, backed by an eval harness and confidence - based fallbacks to catch low - quality extractions.
                \item \textbf{ RAG - powered retrieval:} Replaced keyword search with \textbf{ pgvector } embedding similarity for mentor matching, and built a \textbf{ RAG } chat assistant scoped to a user's own history for natural-language recall of past goals.
                \item \textbf{Agentic platform:} Integrated \textbf{Model Context Protocol } to expose Calendar and goal - tracking as tools for autonomous scheduling, built on \textbf{ Next.js Server Actions }, \textbf{ RSC }, \textbf{React Query }, \textbf{ Clerk }, and \textbf{ Chart.js }.
                \item(\href{
                    https://mentorflow.iamstackless.com/}{\textbf{mentorflow.iamstackless.com}})
                    \end{ tightemize }

                    \end{ minipage }
                    \end{ document }
