import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-20 bg-zinc-950 relative overflow-hidden dot-grid min-h-screen">
      <SEO
        title="Conditions d'Utilisation — HaitianDev"
        description="Consultez les conditions générales d'utilisation et de prestation de services de HaitianDev Studio pour vos projets technologiques."
        schema={getOrganizationSchema()}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-6 mb-16">
            <div className="flex items-center space-x-3 text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full w-max">
              <FileText className="w-5 h-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">Légal</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2">
              Conditions d'Utilisation
            </h1>
            <p className="text-zinc-500 font-mono text-sm">
              Dernière mise à jour : 8 Juin 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-zinc max-w-none space-y-12">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">1. Acceptation des conditions</h2>
              <p className="text-zinc-400 leading-relaxed">
                En accédant au site web et aux services de HaitianDev, vous acceptez d'être lié par les présentes Conditions d'Utilisation. Si vous n'acceptez pas l'ensemble de ces conditions, vous êtes invité à ne pas utiliser nos services ni naviguer sur notre site. Ces conditions constituent un contrat juridique contraignant entre vous et HaitianDev.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">2. Description des services</h2>
              <p className="text-zinc-400 leading-relaxed">
                HaitianDev opère en tant que studio d'ingénierie technologique de pointe. Nos prestations s'articulent autour de plusieurs axes :
              </p>
              <ul className="list-disc pl-5 text-zinc-400 space-y-2 marker:text-blue-500">
                <li><strong>Développement Web :</strong> création d'applications web complètes, plateformes sur-mesure et landing pages à haute conversion.</li>
                <li><strong>Applications Mobiles :</strong> ingénierie d'applications iOS et Android natives ou cross-platform.</li>
                <li><strong>Solutions Intelligence Artificielle :</strong> intégration d'API prédictives, LLMs et automatisation avancée.</li>
                <li><strong>Jeux Vidéo & 3D :</strong> développement de solutions interactives et immersives.</li>
                <li><strong>Formation :</strong> cursus technologique avancé via notre pôle d'éducation.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">3. Propriété intellectuelle</h2>
              <p className="text-zinc-400 leading-relaxed">
                L'ensemble du contenu du site web (codes sources de présentation, textes, graphiques, logos de la marque HaitianDev) est la propriété exclusive de HaitianDev et est protégé par les lois sur la propriété intellectuelle.
                <br /><br />
                Concernant nos prestations d'ingénierie client : une fois la prestation terminée et le paiement intégralement acquitté, la propriété intellectuelle des livrables finaux (codes, assets) est transférée au client selon les termes spécifiques établis dans le contrat de service individuel.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">4. Utilisation du site</h2>
              <p className="text-zinc-400 leading-relaxed">
                En utilisant notre site internet, vous vous engagez à ne pas effectuer les actions suivantes :
              </p>
              <ul className="list-disc pl-5 text-zinc-400 space-y-2 marker:text-red-500">
                <li>Copier, reproduire, scraper ou exploiter le contenu du site sans autorisation écrite préalable.</li>
                <li>Tenter de contourner les protocoles de sécurité, incluant nos protections anti-copie et anti-capture d'écran associées au projet.</li>
                <li>Transmettre des virus, des codes malveillants ou mener des attaques de type déni de service (DDoS).</li>
                <li>Utiliser le site de manière abusive pour nuire à l'image ou à l'infrastructure d'HaitianDev.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">5. Comptes utilisateurs</h2>
              <p className="text-zinc-400 leading-relaxed">
                Certaines parties de nos plateformes (notamment la partie Formation ou le Portail Client) peuvent nécessiter la création d'un compte. En créant un compte, vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion. Vous acceptez de nous informer immédiatement en cas d'utilisation non autorisée de votre compte.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">6. Paiements et facturation</h2>
              <p className="text-zinc-400 leading-relaxed">
                Pour toutes les prestations contractuelles, un devis détaillé est fourni avant le lancement du projet. Les conditions de paiement (acomptes, phases de développement, paiement final) sont stipulées dans nos accords commerciaux de gré à gré. Nous acceptons divers moyens de paiement (carte bancaire, virements, systèmes locaux comme MonCash). Les factures doivent être strictement honorées dans les délais indiqués pour éviter l'interruption des services liés au projet.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">7. Limitation de responsabilité</h2>
              <p className="text-zinc-400 leading-relaxed">
                Bien que nous mettions en œuvre les meilleures pratiques d'ingénierie et de sécurité, HaitianDev ne peut être tenu responsable des dommages indirects, pertes de bénéfices, pertes de données ou interruptions de service découlant de l'utilisation de nos plateformes ou des solutions logicielles fournies. Nos solutions sont fournies "en l'état" avec l'engagement moral de rectifier tout défaut couvert par la période de garantie du contrat établi.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">8. Garanties</h2>
              <p className="text-zinc-400 leading-relaxed">
                HaitianDev s'engage sur la qualité de son code et fournit généralement une garantie contractuelle contre les bogues de développement dans une période définie après la livraison. Toutefois, nous ne garantissons pas de résultats commerciaux spécifiques liés au lancement de vos applications (succès d'une campagne de financement, acquisition virale de clients, etc.), qui sont l'apanage des dynamiques du marché.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">9. Résiliation</h2>
              <p className="text-zinc-400 leading-relaxed">
                Nous nous réservons le droit exclusif de suspendre, d'interrompre ou de résilier définitivement votre accès à une partie ou l'intégralité de nos plateformes, avec ou sans préavis, en cas de violation manifeste de l'une de ces conditions d'utilisation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">10. Liens tiers</h2>
              <p className="text-zinc-400 leading-relaxed">
                Le site peut contenir des liens vers des sites ou des outils d'éditeurs tiers (documentations, partenaires, bibliothèques open-source). HaitianDev n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou pratiques de confidentialité.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">11. Modifications des conditions</h2>
              <p className="text-zinc-400 leading-relaxed">
                HaitianDev se réserve en tout temps le droit d'actualiser, de modifier ou de remplacer tout ou une partie des présentes Conditions d'Utilisation. Il vous incombe de consulter cette page de temps à autre. L'utilisation continue de nos services vaut acceptation inconditionnelle des nouvelles conditions publiées.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">12. Loi applicable</h2>
              <p className="text-zinc-400 leading-relaxed">
                Les présentes Conditions d'Utilisation et tout contrat distinct par lequel nous fournissons nos services seront régis et interprétés exclusivement selon les lois de la République d'Haïti, et les litiges éventuels relèveront de la juridiction compétente de ce pays, sans donner effet aux principes régissant les conflits de lois.
              </p>
            </section>

            <section className="space-y-4 bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800">
              <h2 className="text-2xl font-display font-bold text-white">13. Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                Pour toute demande relative aux présentes conditions ou à nos pratiques commerciales, veuillez nous adresser un courriel au pôle juridique :
              </p>
              <div className="mt-4">
                <a href="mailto:legal@haitiandev.lovable.app" className="text-red-400 hover:text-red-300 font-mono transition-colors">
                  legal@haitiandev.lovable.app
                </a>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};
