import * as React from 'react';
import { BrukerModell, EtikettType, VeilederModell } from '../../model-interfaces';
import { FormattedMessage } from 'react-intl';
import { Kolonne } from '../../ducks/ui/listevisning';
import Etikett from './etikett';

interface VeiledernavnProps {
    className?: string;
    bruker: BrukerModell;
    valgteKolonner: Kolonne[];
    veileder?: VeilederModell;
}

const fm = (id) => <FormattedMessage id={id} />;

function VeilederNavn({ className, bruker, valgteKolonner, veileder }: VeiledernavnProps) {
    const veilederNavn = veileder ? `${veileder.etternavn}, ${veileder.fornavn}` : '';
    if (valgteKolonner.includes(Kolonne.VEILEDER)) {
        return (
            <div className={className}>
                {
                    bruker.veilederId ?
                        <span>{veilederNavn}</span>
                        :
                        <Etikett
                            type={EtikettType.NYBRUKER}
                            child={fm('enhet.portefolje.tabelletikett.ny.bruker')}
                            skalVises={bruker.veilederId === null}
                        />
                }
            </div>
        );
    } else {
        return null;
    }
}

export default VeilederNavn;
