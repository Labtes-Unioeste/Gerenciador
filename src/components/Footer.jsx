import { motion } from 'framer-motion'
import { ICONS } from '../lib/icons.js'

const ease = [0.22, 1, 0.36, 1]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="fgrid">
        <div className="fbrand">
          <img className="fbrand-logo" src="/logo-tecfert-v2.png" alt="Rede TecFert do Paraná" />
          <b>
            <ICONS.Leaf size={16} strokeWidth={2} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Rede de Fertilizantes do Paraná
          </b>
          <p>
            Conectando empresas, pesquisadores, universidades e redes que impulsionam a
            inovação e o desenvolvimento sustentável do agronegócio paranaense.
          </p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><a href="#content">Visão Geral</a></li>
            <li><a href="#map">Empresas</a></li>
            <li><a href="#map">Pesquisadores</a></li>
            <li><a href="#map">Universidades</a></li>
            <li><a href="#map">Biofertilizantes</a></li>
          </ul>
        </div>
        <div>
          <h4>Recursos</h4>
          <ul>
            <li><a href="#map">Mapa do Paraná</a></li>
            <li><a href="#content">Redes &amp; Eventos</a></li>
            <li><a href="#">Relatórios</a></li>
            <li><a href="#">Como usar</a></li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li>Prof. José Oswaldo — Coordenador</li>
            <li>UNIOESTE · Cascavel/PR</li>
            <li>
              <ICONS.Mail size={13} strokeWidth={2} style={{ verticalAlign: '-1px', marginRight: 4 }} />
              rede.fertilizantes@unioeste.br
            </li>
          </ul>
        </div>
      </div>
      <div className="copy">
        © {new Date().getFullYear()} Rede de Fertilizantes do Paraná · UNIOESTE. App gerado a
        partir da planilha <b>rede_contatos_po_de_rocha_parana (1).xlsx</b>. O controle de
        “contatado” é salvo localmente neste navegador (localStorage).
      </div>
    </motion.footer>
  )
}
