import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-20 bg-zinc-950 relative overflow-hidden dot-grid min-h-screen">
      <SEO
        title="Politique de Confidentialité — HaitianDev"
        description="Consultez les engagements de HaitianDev concernant la sécurité, la confidentialité et l'hébergement réglementaire de vos données selon le standard RGPD."
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
            <div className="flex items-center space-x-3 text-blue-500 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full w-max">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">Confidentialité</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2">
              Politique de Confidentialité
            </h1>
            <p className="text-zinc-500 font-mono text-sm">
              Dernière mise à jour : 8 Juin 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-zinc max-w-none space-y-12">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">1. Introduction</h2>
              <p className="text-zinc-400 leading-relaxed">
                Chez HaitianDev, nous accordons une importance primordiale à la protection de vos données personnelles. Cette Politique de Confidentialité décrit comment nous collectons, utilisons, protégeons et partageons vos informations lorsque vous utilisez notre site web, nos applications ou nos services de développement et d'ingénierie logicielle.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">2. Informations collectées</h2>
              <p className="text-zinc-400 leading-relaxed">
                Dans le cadre de nos activités, nous sommes susceptibles de collecter différents types d'informations, incluant mais sans s'y limiter :
              </p>
              <ul className="list-disc pl-5 text-zinc-400 space-y-2 marker:text-blue-500">
                <li><strong>Informations d'identification :</strong> nom, prénom, adresse e-mail, numéro de téléphone.</li>
                <li><strong>Informations professionnelles :</strong> nom de l'entreprise, poste occupé, secteur d'activité.</li>
                <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, temps passé sur le site.</li>
                <li><strong>Données techniques :</strong> spécifications de projet, accès aux serveurs (uniquement lorsque nécessaire et explicitement autorisé).</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">3. Méthodes de collecte</h2>
              <p className="text-zinc-400 leading-relaxed">
                Vos données sont collectées par plusieurs moyens lors de vos interactions avec HaitianDev :
              </p>
              <ul className="list-disc pl-5 text-zinc-400 space-y-2 marker:text-red-500">
                <li>Lorsque vous remplissez un formulaire de contact ou de demande de devis sur notre site.</li>
                <li>Lors de votre inscription à nos programmes de formation via l'École Supérieure d'Infotronique.</li>
                <li>Automatiquement via nos cookies et outils d'analyse (analytics) lors de votre navigation.</li>
                <li>Lors d'échanges par e-mail ou lors de réunions de cadrage de projet.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">4. Utilisation des informations</h2>
              <p className="text-zinc-400 leading-relaxed">
                Les informations que nous collectons sont utilisées dans des buts précis et légitimes :
              </p>
              <ul className="list-disc pl-5 text-zinc-400 space-y-2 marker:text-blue-500">
                <li>Pour fournir et assurer le suivi des services de développement (applications, web, IA, jeux).</li>
                <li>Pour vous recontacter suite à une demande d'information ou de devis.</li>
                <li>Pour améliorer l'expérience utilisateur et l'interface de nos plateformes.</li>
                <li>Pour répondre à nos obligations contractuelles et légales.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">5. Partage des données</h2>
              <p className="text-zinc-400 leading-relaxed">
                <strong>HaitianDev ne vend, ne loue, ni ne commercialise vos données personnelles à des tiers.</strong>
                <br /><br />
                Nous pouvons toutefois partager vos données avec des prestataires de confiance (hébergeurs cloud, services d'emailing) qui assurent l'exploitation de nos services. Ces partenaires sont liés par des accords de confidentialité stricts. Nous pouvons également divulguer vos données si la loi l'exige.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">6. Cookies et technologies de suivi</h2>
              <p className="text-zinc-400 leading-relaxed">
                Nous utilisons des cookies essentiels pour le bon fonctionnement de notre site et des cookies analytiques pour comprendre l'utilisation qui en est faite. Vous avez la possibilité de configurer votre navigateur pour refuser les cookies, bien que cela puisse altérer certaines fonctionnalités de notre site web.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">7. Sécurité des données</h2>
              <p className="text-zinc-400 leading-relaxed">
                La sécurité est au cœur de notre ingénierie. Nous mettons en œuvre des protocoles de sécurité avancés (chiffrement TLS/SSL, accès restreints, bases de données sécurisées) pour prévenir l'accès non autorisé, l'altération ou la destruction de vos informations personnelles.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">8. Droits des utilisateurs</h2>
              <p className="text-zinc-400 leading-relaxed">
                Conformément aux standards internationaux, vous disposez de plusieurs droits concernant vos données personnelles :
              </p>
              <ul className="list-disc pl-5 text-zinc-400 space-y-2 marker:text-red-500">
                <li>Droit d'accès à vos données.</li>
                <li>Droit de rectification des informations inexactes.</li>
                <li>Droit de suppression (droit à l'oubli).</li>
                <li>Droit à la portabilité (exporter vos données).</li>
                <li>Droit d'opposition à certains traitements de données.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">9. Conservation des données</h2>
              <p className="text-zinc-400 leading-relaxed">
                Vos données personnelles sont conservées le temps nécessaire à l'accomplissement des finalités décrites dans cette politique, ou pour la durée requise par nos obligations juridiques et fiscales, après quoi elles sont supprimées ou anonymisées en toute sécurité.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-white">10. Modifications de la politique</h2>
              <p className="text-zinc-400 leading-relaxed">
                Nous nous réservons le droit de modifier cette Politique de Confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour révisée. Pour les modifications majeures, nous vous informerons directement par e-mail.
              </p>
            </section>

            <section className="space-y-4 bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800">
              <h2 className="text-2xl font-display font-bold text-white">11. Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                Pour toute question ou demande concernant la protection de vos données personnelles, l'équipe responsable de la conformité de HaitianDev se tient à votre disposition :
              </p>
              <div className="mt-4">
                <a href="mailto:privacy@haitiandev.lovable.app" className="text-blue-400 hover:text-blue-300 font-mono transition-colors">
                  privacy@haitiandev.lovable.app
                </a>
              </div>
            </section>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
};
