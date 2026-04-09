import type { ExerciseDef, PainRegionSlug } from "@/types";

const safetyDefault =
  "Pare se sentir dor aguda, dormência intensa ou tonturas. Este programa é educativo e não substitui avaliação clínica.";

function ex(
  partial: Omit<ExerciseDef, "safetyNotes"> & { safetyNotes?: string }
): ExerciseDef {
  return { ...partial, safetyNotes: partial.safetyNotes ?? safetyDefault };
}

const lombar: ExerciseDef[] = [
  ex({
    slug: "lombar-respiracao-diafragmatica",
    regionSlug: "lombar",
    order: 1,
    title: "Respiração diafragmática",
    description:
      "Ativa o diafragma e reduz a tensão dos músculos estabilizadores lombares.",
    objective: "Diminuir rigidez e melhorar controlo da pressão intra-abdominal.",
    durationMinutes: 4,
    repsOrTime: "8 a 10 ciclos de respiração",
    steps: [
      "Deite-se de costas com joelhos flexionados e pés apoiados.",
      "Mão no abdómen; ao inspirar pelo nariz, deixe o abdómen subir suavemente.",
      "Expire pela boca lentamente, sem forçar a coluna.",
      "Mantenha o ritmo calmo, ombros soltos.",
    ],
  }),
  ex({
    slug: "lombar-pelvic-tilt",
    regionSlug: "lombar",
    order: 2,
    title: "Inclinação pélvica (pelvic tilt)",
    description:
      "Mobilização suave entre flexão e extensão lombar para reduzir bloqueio sensorial.",
    objective: "Restaurar amplitude confortável da zona baixa das costas.",
    durationMinutes: 5,
    repsOrTime: "10 a 12 repetições lentas",
    steps: [
      "De costas, joelhos flexionados, pés na largura do quadril.",
      "Achatamento suave da zona lombar contra o chão (sem levantar glúteos).",
      "Inverter: arqueamento mínimo aceitável, sem dor.",
      "Movimento pequeno e controlado; respire de forma contínua.",
    ],
  }),
  ex({
    slug: "lombar-gato-camelo",
    regionSlug: "lombar",
    order: 3,
    title: "Gato-camelo (quatro apoios)",
    description:
      "Flexo-extensão segmentar suave para lubrificar a coluna e relaxar paravertebrais.",
    objective: "Melhorar conforto ao mudar de postura no dia a dia.",
    durationMinutes: 6,
    repsOrTime: "8 a 10 ciclos completos",
    steps: [
      "Quatro apoios: mãos sob ombros, joelhos sob ancas.",
      "Inspire; na expiração, arredonde suavemente as costas (gato).",
      "Inspire abrindo o peito e deixando a coluna ir a um arco confortável (camelo).",
      "Não force o fim de amplitude; mantenha o pescoço neutro.",
    ],
  }),
  ex({
    slug: "lombar-child-pose-modificado",
    regionSlug: "lombar",
    order: 4,
    title: "Postura da criança (modificada)",
    description:
      "Alongamento leve da cadeia posterior com apoio seguro para a lombar.",
    objective: "Promover alívio percebido após períodos prolongados sentado.",
    durationMinutes: 4,
    repsOrTime: "3 vezes × 30–45 s",
    steps: [
      "Ajoelhe-se e sente-se para trás sobre os calcanhares (use almofada se precisar).",
      "Estenda os braços à frente ou ao lado do corpo, o que for mais confortável.",
      "Respire fundo; não deve haver dor em pontada.",
      "Suba devagar terminando.",
    ],
  }),
  ex({
    slug: "lombar-ponte-gluteo",
    regionSlug: "lombar",
    order: 5,
    title: "Ponte de glúteo",
    description:
      "Ativação de glúteos e estabilizadores para descarregar tensão sobre a lombar.",
    objective: "Reforçar extensão de quadril sem comprimir a zona baixa das costas.",
    durationMinutes: 6,
    repsOrTime: "12 repetições × 2 séries",
    steps: [
      "De costas, joelhos flexionados, calcanhares perto dos glúteos.",
      "Expire e eleve a anca até alinhar ombros–anca–joelhos.",
      "Aperte os glúteos no topo sem hiperextender a lombar.",
      "Desça com controlo; repita.",
    ],
  }),
  ex({
    slug: "lombar-bird-dog",
    regionSlug: "lombar",
    order: 6,
    title: "Bird-dog (cão pássaro)",
    description:
      "Estabilização contralateral para melhorar controlo motor do tronco.",
    objective: "Aumentar robustez fina sem impacto nas articulações.",
    durationMinutes: 7,
    repsOrTime: "8 repetições por lado",
    steps: [
      "Quatro apoios, coluna neutra.",
      "Estenda braço direito e perna esquerda até ficarem paralelos ao chão.",
      "Mantenha quadril estável; evite rodar o tronco.",
      "Alterne os lados devagar.",
    ],
  }),
  ex({
    slug: "lombar-dead-bug",
    regionSlug: "lombar",
    order: 7,
    title: "Dead bug",
    description:
      "Controlo do tronco com membros em movimento — base segura para o dia a dia.",
    objective: "Coordenar abdómen profundo com respiração.",
    durationMinutes: 6,
    repsOrTime: "10 repetições por lado",
    steps: [
      "De costas, braços para o teto, joelhos a 90° sobre a anca.",
      "Pressione ligeiramente a zona lombar no chão.",
      "Estenda perna e braço opostos, mantendo o tronco estável.",
      "Volte e alterne.",
    ],
  }),
  ex({
    slug: "lombar-clamshell",
    regionSlug: "lombar",
    order: 8,
    title: "Clamshell (concha)",
    description:
      "Ativação do médio de glúteo para melhor alinhamento da pelve e menos sobrecarga lombar.",
    objective: "Isolar quadril sem compensações da coluna.",
    durationMinutes: 5,
    repsOrTime: "12 repetições × 2 lados",
    steps: [
      "De lado, joelhos flexionados a 45°, pés juntos.",
      "Abra só o joelho de cima, mantendo os pés em contacto.",
      "Não role o quadril para trás.",
      "Controle a descida.",
    ],
  }),
];

const pescoco: ExerciseDef[] = [
  ex({
    slug: "pescoco-postura-neutra",
    regionSlug: "pescoco",
    order: 1,
    title: "Reprogramação de postura neutra",
    description:
      "Repor orelha–ombro–anca numa linha suave, sem rigidez.",
    objective: "Reduzir tensão acumulada em frente ao ecrã.",
    durationMinutes: 3,
    repsOrTime: "6 repetições de 20 s",
    steps: [
      "Sente-se com pés apoiados; olhe ao horizonte.",
      "Recue o queixo 1–2 cm (como um caracol), alongando a nuca.",
      "Solte os ombros para baixo e para trás, sem arquear costas.",
      "Respire; solte a mandíbula.",
    ],
  }),
  ex({
    slug: "pescoco-rotacao-gentil",
    regionSlug: "pescoco",
    order: 2,
    title: "Rotação cervical gentil",
    description:
      "Amplitude confortável para descomprimir tecidos moles laterais.",
    objective: "Melhorar conforto ao virar a cabeça ao conduzir ou ler.",
    durationMinutes: 4,
    repsOrTime: "5 repetições por lado",
    steps: [
      "Sente-se ereto; ombros relaxados.",
      "Vire a cabeça para a direita até uma tensão leve, não dor.",
      "Mantenha 3–5 s; volte ao centro.",
      "Repita para a esquerda.",
    ],
  }),
  ex({
    slug: "pescoco-inclinacao-lateral",
    regionSlug: "pescoco",
    order: 3,
    title: "Inclinação lateral",
    description:
      "Alongamento do trapézio superior e escalenos com controlo.",
    objective: "Aliviar peso percebido nos ombros.",
    durationMinutes: 4,
    repsOrTime: "4 repetições por lado",
    steps: [
      "Ombro direito desce; incline a orelha esquerda em direção ao ombro.",
      "Pode apoiar a mão no lado oposto da cabeça com peso mínimo.",
      "Mantenha 15–20 s; troque de lado.",
    ],
  }),
  ex({
    slug: "pescoco-flexao-extensao",
    regionSlug: "pescoco",
    order: 4,
    title: "Flexão e extensão suaves",
    description:
      "Movimento nodding controlado para mobilizar segmentos superiores.",
    objective: "Reduzir sensação de rigidez ao acordar.",
    durationMinutes: 4,
    repsOrTime: "8 ciclos lentos",
    steps: [
      "Queixo ao peito com movimento pequeno.",
      "Depois olhe ligeiramente para cima sem comprimir a nuca.",
      "Amplitude submáxima; qualidade sobre quantidade.",
    ],
  }),
  ex({
    slug: "pescoco-scapular-squeeze",
    regionSlug: "pescoco",
    order: 5,
    title: "Aperto escapular (retração)",
    description:
      "Fortalecimento leve dos estabilizadores escapulares.",
    objective: "Suportar uma cabeça mais alinhada por mais tempo.",
    durationMinutes: 5,
    repsOrTime: "12 repetições",
    steps: [
      "Braços ao lado, cotovelos flexionados a 90°.",
      "Leve as escápulas juntas como se segurasse um lápis entre elas.",
      "Mantenha 3 s; solte devagar.",
    ],
  }),
  ex({
    slug: "pescoco-torcao-torax",
    regionSlug: "pescoco",
    order: 6,
    title: "Torção suave do tórax sentado",
    description:
      "Mobilidade torácica para reduzir compensações no pescoço.",
    objective: "Melhorar rotação do tronco sem forçar o pescoço.",
    durationMinutes: 5,
    repsOrTime: "6 repetições por lado",
    steps: [
      "Sente-se; mão direita no joelho esquerdo.",
      "Rode o tronco à esquerda; olhe suavemente na mesma direação.",
      "O pescoço segue o tronco sem snap.",
    ],
  }),
  ex({
    slug: "pescoco-elevacao-ombros",
    regionSlug: "pescoco",
    order: 7,
    title: "Elevação e soltar ombros",
    description:
      "Reset neuromuscular para quem acumula tensão em escritório.",
    objective: "Consciencializar e libertar ombros elevados.",
    durationMinutes: 3,
    repsOrTime: "10 repetições",
    steps: [
      "Eleve os ombros às orelhas na inspiração.",
      "Expire e deixe-os cair com peso.",
      "Sinta o alongamento lateral do pescoço ao soltar.",
    ],
  }),
  ex({
    slug: "pescoco-isometricos",
    regionSlug: "pescoco",
    order: 8,
    title: "Isométricos cervicais leves",
    description:
      "Contracções submáximas em 4 direções para estabilidade.",
    objective: "Fortalecer sem amplitude — útil em fases sensíveis.",
    durationMinutes: 6,
    repsOrTime: "5 s × 4 direções × 2 rondas",
    steps: [
      "Mão na testa; empurre a cabeça contra a mão sem mover.",
      "Repita lateralmente (mão na têmpora) e atrás da cabeça.",
      "Força até 30–40% do máximo apenas.",
    ],
  }),
];

const ombro: ExerciseDef[] = [
  ex({
    slug: "ombro-pendulo",
    regionSlug: "ombro",
    order: 1,
    title: "Pêndulo de Codman",
    description:
      "Movimento assistido pela gravidade para nutrição articular suave.",
    objective: "Melhorar conforto em fases irritáveis do ombro.",
    durationMinutes: 4,
    repsOrTime: "2 minutos por braço",
    steps: [
      "Incline o tronco; deixe o braço pendurado.",
      "Movimentos pequenos em círculos e figuras-oito.",
      "Sem tensar o trapézio; corpo relaxado.",
    ],
  }),
  ex({
    slug: "ombro-passthrough-varinha",
    regionSlug: "ombro",
    order: 2,
    title: "Varinha — flexão assistida",
    description:
      "Ganhar elevação frontal com ombro indolor.",
    objective: "Restaurar elevação sem forçar o tendão.",
    durationMinutes: 5,
    repsOrTime: "12 repetições",
    steps: [
      "Segure um cabo/varinha com as duas mãos.",
      "Use o braço bom para ajudar o afetado a subir à frente.",
      "Desça com controlo.",
    ],
  }),
  ex({
    slug: "ombro-rotao-externa-varinha",
    regionSlug: "ombro",
    order: 3,
    title: "Rotação externa com varinha",
    description:
      "Trabalho em plano escapular para estabilidade posterior.",
    objective: "Reforçar rotadores externos sem compensação.",
    durationMinutes: 5,
    repsOrTime: "10 repetições",
    steps: [
      "Cotovelos a 90°, junto ao corpo.",
      "Abra as mãos para os lados mantendo cotovelos fixos.",
      "Amplitude confortável apenas.",
    ],
  }),
  ex({
    slug: "ombro-face-pull",
    regionSlug: "ombro",
    order: 4,
    title: "Face pull (elástico leve)",
    description:
      "Retroposição escapular e saúde da cintura posterior.",
    objective: "Contrapor postura de ombros internamente rodados.",
    durationMinutes: 6,
    repsOrTime: "12 repetições × 2 séries",
    steps: [
      "Elástico na altura do rosto; puxe em direção ao nariz separando as mãos.",
      "Cotovelos altos; aperte escápulas.",
      "Evite arquear a lombar.",
    ],
  }),
  ex({
    slug: "ombro-wall-slide",
    regionSlug: "ombro",
    order: 5,
    title: "Wall slide (Y)",
    description:
      "Movimento em parede para escápula e ombro.",
    objective: "Melhorar elevação com boa mecânica escapular.",
    durationMinutes: 5,
    repsOrTime: "10 repetições",
    steps: [
      "Costas na parede; braços em W.",
      "Deslize para Y sem perder contacto com a parede.",
      "Se falhar, afaste ligeiramente os pés.",
    ],
  }),
  ex({
    slug: "ombro-cross-body",
    regionSlug: "ombro",
    order: 6,
    title: "Alongamento cross-body",
    description:
      "Alongamento da porção posterior do manguito e deltoide.",
    objective: "Ganhar conforto pós-treino ou trabalho de braços.",
    durationMinutes: 3,
    repsOrTime: "3 × 25 s por braço",
    steps: [
      "Traga o braço horizontalmente ao peito com a outra mão.",
      "Ombro relaxado para baixo.",
      "Respire; não force torção do tronco.",
    ],
  }),
  ex({
    slug: "ombro-empty-can-mod",
    regionSlug: "ombro",
    order: 7,
    title: "Elevação lateral leve (modificada)",
    description:
      "Fortalecimento do deltoide médio com carga mínima ou sem peso.",
    objective: "Progressão suave para atividades do quotidiano.",
    durationMinutes: 6,
    repsOrTime: "10 repetições × 2 séries",
    steps: [
      "Pesos leves ou garrafas de água.",
      "Eleve lateralmente até a altura do ombro, cotovelos com leve flexão.",
      "Sem encostar o trapézio à orelha.",
    ],
  }),
  ex({
    slug: "ombro-serratus-push-plus",
    regionSlug: "ombro",
    order: 8,
    title: "Push-up plus (de joelhos)",
    description:
      "Protração escapular para saúde da escápula.",
    objective: "Estabilizar o ombro na fase final de elevação.",
    durationMinutes: 5,
    repsOrTime: "8 a 12 repetições",
    steps: [
      "Quatro apoios ou de joelhos.",
      "Faça mini-protração: empurre o chão afastando as escápulas.",
      "Mantenha cotovelos micro-flexionados.",
    ],
  }),
];

const joelho: ExerciseDef[] = [
  ex({
    slug: "joelho-extensao-quad-sentado",
    regionSlug: "joelho",
    order: 1,
    title: "Extensão de joelho sentado",
    description:
      "Ativação do quadríceps sem carga axial elevada.",
    objective: "Melhorar controlo da extensão e conforto na subida de escadas.",
    durationMinutes: 5,
    repsOrTime: "12 repetições × 2 pernas",
    steps: [
      "Sentado, estenda o joelho até apoiar o calcanhar no chão.",
      "Aperte o quadríceps 2–3 s.",
      "Desça com controlo.",
    ],
  }),
  ex({
    slug: "joelho-ponte-unilateral-mod",
    regionSlug: "joelho",
    order: 2,
    title: "Ponte unilateral (modificada)",
    description:
      "Cadeia posterior e estabilidade do joelho em alinhamento.",
    objective: "Reforçar glúteo e isquiotibiais com menos stress patelar.",
    durationMinutes: 6,
    repsOrTime: "8 repetições por perna",
    steps: [
      "De costas, uma perna estendida no ar.",
      "Eleve a anca com a perna apoiada.",
      "Quadril estável; joelho aponta para o teto.",
    ],
  }),
  ex({
    slug: "joelho-mini-agachamento",
    regionSlug: "joelho",
    order: 3,
    title: "Mini-agachamento",
    description:
      "Padrão de movimento com amplitude curta e joelhos alinhados.",
    objective: "Transferir força para atividades funcionais.",
    durationMinutes: 6,
    repsOrTime: "12 repetições",
    steps: [
      "Pés na largura do quadril; peso nos calcanhares.",
      "Desça 20–30 cm mantendo joelhos alinhados com os pés.",
      "Suba empurrando o chão.",
    ],
  }),
  ex({
    slug: "joelho-step-up-baixo",
    regionSlug: "joelho",
    order: 4,
    title: "Step-up baixo",
    description:
      "Controlo unilateral com apoio seguro.",
    objective: "Melhorar confiança ao subir degraus.",
    durationMinutes: 7,
    repsOrTime: "10 repetições por perna",
    steps: [
      "Degrau 15–20 cm; pé completo no degrau.",
      "Suba sem impulso do pé de trás.",
      "Desça devagar; use corrimão se necessário.",
    ],
  }),
  ex({
    slug: "joelho-prancha-lateral-mod",
    regionSlug: "joelho",
    order: 5,
    title: "Prancha lateral (joelhos)",
    description:
      "Estabilidade de quadril que protege alinhamento do joelho.",
    objective: "Reduzir valgo dinâmico em movimentos do dia a dia.",
    durationMinutes: 4,
    repsOrTime: "2 × 20 s por lado",
    steps: [
      "Apoie joelho e cotovelo alinhados.",
      "Corpo em linha reta; quadril elevado.",
      "Respire com regularidade.",
    ],
  }),
  ex({
    slug: "joelho-clamshell-faixa",
    regionSlug: "joelho",
    order: 6,
    title: "Clamshell com faixa (opcional)",
    description:
      "Médio de glúteo para controlo do joelho em valgo.",
    objective: "Melhorar alinhamento em agachamento e corrida leve.",
    durationMinutes: 5,
    repsOrTime: "12 repetições × 2 lados",
    steps: [
      "De lado com faixa leve acima dos joelhos.",
      "Abra o joelho superior sem rodar o tronco.",
      "Controle a descida.",
    ],
  }),
  ex({
    slug: "joelho-calf-stretch",
    regionSlug: "joelho",
    order: 7,
    title: "Alongamento da panturrilha em parede",
    description:
      "Reduz tensão na cadeia posterior que influencia a biomecânica do joelho.",
    objective: "Melhorar conforto após caminhadas longas.",
    durationMinutes: 4,
    repsOrTime: "3 × 25 s por perna",
    steps: [
      "Mãos na parede; uma perna atrás estendida.",
      "Calcanhar no chão; incline o tronco até sentir alongamento suave.",
      "Joelho de trás permanece estendido.",
    ],
  }),
  ex({
    slug: "joelho-terminal-extensao",
    regionSlug: "joelho",
    order: 8,
    title: "Extensão terminal com toalha",
    description:
      "Pequena amplitude para melhorar extensão completa sem dor.",
    objective: "Recuperar simetria de extensão entre joelhos.",
    durationMinutes: 4,
    repsOrTime: "5 repetições × 10 s",
    steps: [
      "Sentado com perna estendida; toalha enrolada sob o joelho.",
      "Pressione o joelho para baixo ativando o quadríceps.",
      "Sem dor aguda na frente do joelho.",
    ],
  }),
];

const quadril: ExerciseDef[] = [
  ex({
    slug: "quadril-90-90-respiracao",
    regionSlug: "quadril",
    order: 1,
    title: "Respiração 90/90",
    description:
      "Reposicionamento suave da pelve e da cápsula do quadril.",
    objective: "Melhorar sensação de espaço na anca antes de mobilizar.",
    durationMinutes: 4,
    repsOrTime: "8 ciclos",
    steps: [
      "De costas, ancas e joelhos a 90° com pés no chão (ou apoio na parede).",
      "Inspire expandindo as costelas; expire suavemente.",
      "Sem forçar rotação das ancas.",
    ],
  }),
  ex({
    slug: "quadril-pigeon-mod",
    regionSlug: "quadril",
    order: 2,
    title: "Pigeon em cadeira (modificado)",
    description:
      "Alongamento do glúteo e rotadores externos com apoio estável.",
    objective: "Aliviar tensão lateral da anca.",
    durationMinutes: 5,
    repsOrTime: "2 × 30 s por lado",
    steps: [
      "Sentado, tornozelo no joelho oposto formando figura de 4.",
      "Incline o tronco até tensão confortável.",
      "Coluna neutra; troque de lado.",
    ],
  }),
  ex({
    slug: "quadril-bridge-march",
    regionSlug: "quadril",
    order: 3,
    title: "Ponte com marcha lenta",
    description:
      "Estabilidade de quadril em extensão com alternância de membros.",
    objective: "Preparar a anca para caminhada com controlo.",
    durationMinutes: 6,
    repsOrTime: "10 alternâncias",
    steps: [
      "Ponte de glúteo no topo.",
      "Levante um joelho até 90° sem baixar o quadril.",
      "Alterne devagar mantendo anca alta.",
    ],
  }),
  ex({
    slug: "quadril-side-lying-abd",
    regionSlug: "quadril",
    order: 4,
    title: "Abdução de quadril de lado",
    description:
      "Glúteo médio para alinhamento da anca em marcha.",
    objective: "Reduzir compensações lombares ao caminhar.",
    durationMinutes: 5,
    repsOrTime: "12 repetições × 2 lados",
    steps: [
      "De lado, joelhos ligeiramente flexionados.",
      "Eleve o joelho superior mantendo pés juntos (variante clamshell).",
      "Quadril estável.",
    ],
  }),
  ex({
    slug: "quadril-hip-flexor-stretch",
    regionSlug: "quadril",
    order: 5,
    title: "Alongamento do flexor do quadril",
    description:
      "Abre a frente da anca após sedentarismo.",
    objective: "Melhorar extensão de quadril com menos arqueamento lombar.",
    durationMinutes: 4,
    repsOrTime: "3 × 25 s por lado",
    steps: [
      "Passo longo à frente; joelho de trás no chão ou pé apoiado atrás.",
      "Empurre a anca para a frente com tronco ereto.",
      "Glúteo da perna de trás ligeiramente contraído.",
    ],
  }),
  ex({
    slug: "quadril-internal-rotation-stretch",
    regionSlug: "quadril",
    order: 6,
    title: "Rotação interna suave sentado",
    description:
      "Mobilidade capsular leve em posição segura.",
    objective: "Complementar rotadores internos sem forçar fim de curso.",
    durationMinutes: 4,
    repsOrTime: "8 repetições por lado",
    steps: [
      "Sentado; tornozelo no joelho oposto.",
      "Pressione gentilmente o joelho em direção ao chão.",
      "Amplitude submáxima.",
    ],
  }),
];

const punho: ExerciseDef[] = [
  ex({
    slug: "punho-tendon-glide",
    regionSlug: "punho",
    order: 1,
    title: "Deslizamento de tendões (tendon gliding)",
    description:
      "Movimentação dos flexores/extensores para reduzir rigidez.",
    objective: "Melhorar conforto após uso prolongado do rato.",
    durationMinutes: 4,
    repsOrTime: "5 ciclos completos",
    steps: [
      "Comece com punho neutro, dedos estendidos.",
      "Flexione punho e feche o punho, depois flexione os nós dos dedos.",
      "Estenda dedos, punho e repita em fluidez.",
    ],
  }),
  ex({
    slug: "punho-extensor-stretch",
    regionSlug: "punho",
    order: 2,
    title: "Alongamento dos extensores",
    description:
      "Abre a face anterior do antebraço e punho.",
    objective: "Equilibrar flexores hipertónicos.",
    durationMinutes: 3,
    repsOrTime: "3 × 20 s",
    steps: [
      "Braço estendido à frente, palma para baixo.",
      "Com a outra mão, flexione o punho gentilmente.",
      "Ombros baixos.",
    ],
  }),
  ex({
    slug: "punho-flexor-stretch",
    regionSlug: "punho",
    order: 3,
    title: "Alongamento dos flexores",
    description:
      "Alívio para tensão na face palmar e epicondilo medial leve.",
    objective: "Melhorar amplitude de extensão do punho.",
    durationMinutes: 3,
    repsOrTime: "3 × 20 s",
    steps: [
      "Braço estendido, palma para cima.",
      "Puxe os dedos para trás com a outra mão.",
      "Sem dor em pontada.",
    ],
  }),
  ex({
    slug: "punho-pronation-supination",
    regionSlug: "punho",
    order: 4,
    title: "Pronação e supinação",
    description:
      "Mobilidade radioulnar com cotovelo junto ao corpo.",
    objective: "Restaurar rotação do antebraço para tarefas domésticas.",
    durationMinutes: 4,
    repsOrTime: "15 repetições lentas",
    steps: [
      "Cotovelo a 90°, junto ao corpo.",
      "Gire a palma para baixo e para cima.",
      "Movimento só no antebraço.",
    ],
  }),
  ex({
    slug: "punho-isometric-wrist",
    regionSlug: "punho",
    order: 5,
    title: "Isométricos de punho",
    description:
      "Estabilização sem amplitude em fases sensíveis.",
    objective: "Manter força com baixo irritativo.",
    durationMinutes: 5,
    repsOrTime: "5 s × 4 direções × 2",
    steps: [
      "Empurre a palma contra a parede ou mão oposta em flexão/extensão/desvio.",
      "Força submáxima; sem dor.",
    ],
  }),
  ex({
    slug: "punho-eccentric-wrist-ext",
    regionSlug: "punho",
    order: 6,
    title: "Excêntrico leve — extensores",
    description:
      "Controlo na fase negativa com peso mínimo.",
    objective: "Preparar tendões para cargas graduais.",
    durationMinutes: 5,
    repsOrTime: "10 repetições",
    steps: [
      "Antebraço apoiado na mesa, punho na borda.",
      "Peso mínimo na mão; levante com ajuda da outra mão se precisar.",
      "Desça sozinho em 3–4 s.",
    ],
  }),
];

const tornozelo: ExerciseDef[] = [
  ex({
    slug: "tornozelo-alphabet",
    regionSlug: "tornozelo",
    order: 1,
    title: "Alfabeto com o pé",
    description:
      "Mobilidade multiplanar controlada.",
    objective: "Recuperar amplitude após entorse leve (fora da fase aguda).",
    durationMinutes: 5,
    repsOrTime: "A–Z uma vez",
    steps: [
      "Sentado, perna livre no ar.",
      "Desenhe letras grandes com o pé.",
      "Sem dor aguda; amplitude confortável.",
    ],
  }),
  ex({
    slug: "tornozelo-calf-raise",
    regionSlug: "tornozelo",
    order: 2,
    title: "Elevação de calcanhares",
    description:
      "Força do gastrocnémio e sóleo para estabilidade do tornozelo.",
    objective: "Melhorar propulsão na marcha.",
    durationMinutes: 5,
    repsOrTime: "15 repetições × 2 séries",
    steps: [
      "Em pé, pés na largura do quadril.",
      "Suba nos dedos; desça com controlo.",
      "Use apoio se necessário.",
    ],
  }),
  ex({
    slug: "tornozelo-towel-curl",
    regionSlug: "tornozelo",
    order: 3,
    title: "Flexão dos dedos com toalha",
    description:
      "Ativação intrínseca do pé.",
    objective: "Suportar arco plantar e propriocepção.",
    durationMinutes: 4,
    repsOrTime: "12 repetições",
    steps: [
      "Toalha no chão sob o pé.",
      "Enrrole puxando com os dedos.",
      "Solte e repita.",
    ],
  }),
  ex({
    slug: "tornozelo-balance-single",
    regionSlug: "tornozelo",
    order: 4,
    title: "Equilíbrio unipodal",
    description:
      "Propriocepção para prevenção de reentorses.",
    objective: "Aumentar confiança em superfícies instáveis.",
    durationMinutes: 5,
    repsOrTime: "3 × 30 s por pé",
    steps: [
      "Em pé num só pé; olhar fixo à frente.",
      "Joelho micro-flexionado.",
      "Troque de pé.",
    ],
  }),
  ex({
    slug: "tornozelo-dorsiflexion-knee-bent",
    regionSlug: "tornozelo",
    order: 5,
    title: "Dorsiflexão com joelho flexionado",
    description:
      "Alongamento do sóleo.",
    objective: "Ganhar dorsiflexão para agachamentos.",
    durationMinutes: 4,
    repsOrTime: "3 × 25 s por perna",
    steps: [
      "Passo à frente; joelho avançado sobre o pé.",
      "Calcanhar traseiro no chão.",
      "Incline até tensão suave na panturrilha baixa.",
    ],
  }),
  ex({
    slug: "tornozelo-inversion-eversion",
    regionSlug: "tornozelo",
    order: 6,
    title: "Inversão e eversão assentadas",
    description:
      "Controlo dos músculos peroneais e tibial.",
    objective: "Restaurar simetria em movimentos laterais.",
    durationMinutes: 4,
    repsOrTime: "12 repetições por direção",
    steps: [
      "Pé no ar; rode a planta para dentro e para fora.",
      "Amplitude pequena e indolor.",
    ],
  }),
];

export const ALL_EXERCISES: ExerciseDef[] = [
  ...lombar,
  ...pescoco,
  ...ombro,
  ...joelho,
  ...quadril,
  ...punho,
  ...tornozelo,
];

export function getExercisesByRegion(
  region: PainRegionSlug
): ExerciseDef[] {
  return ALL_EXERCISES.filter((e) => e.regionSlug === region).sort(
    (a, b) => a.order - b.order
  );
}

export function getExerciseBySlug(slug: string): ExerciseDef | undefined {
  return ALL_EXERCISES.find((e) => e.slug === slug);
}
