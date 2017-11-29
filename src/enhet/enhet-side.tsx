import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import Lenker from './../lenker/lenker';
import { filtervalgShape, veilederShape, statustallShape } from '../proptype-shapes';
import Innholdslaster from './../innholdslaster/innholdslaster';
import EnhetsportefoljeVisning from '../enhetsportefolje/enhetsportefolje-visning';
import FiltreringContainer from '../filtrering/filtrering-container';
import FiltreringLabelContainer from '../filtrering/filtrering-label-container';
import { leggEnhetIUrl } from '../utils/url-utils';
import { hentStatusTall } from '../ducks/statustall';
import { EnhettiltakState, hentEnhetTiltak } from '../ducks/enhettiltak';
import TomPortefoljeModal from '../modal/tom-portefolje-modal';
import ListevisningInfoPanel from '../components/toolbar/listevisning/listevisning-infopanel';
import { AppState } from '../reducer';
import { StatustallModell, ValgtEnhetModell, VeilederModell } from '../model-interfaces';
import { ListevisningState, ListevisningType } from '../ducks/ui/listevisning';
import { FiltreringState } from '../ducks/filtrering';

interface StateProps {
    valgtEnhet: ValgtEnhetModell;
    filtervalg: FiltreringState;
    veilederliste: VeilederModell[];
    statustall: { data: StatustallModell };
    enhettiltak: EnhettiltakState;
    listevisning: ListevisningState;
}

interface DispatchProps {
    hentStatusTall: (enhetId: string) => void;
    hentEnhetTiltak: (enhetId: string) => void;
}

interface OwnProps {
    intl: InjectedIntl;
}

type EnhetSideProps = StateProps & DispatchProps & OwnProps;

class EnhetSide extends React.Component<EnhetSideProps, {}> {
    componentWillMount() {
        const { valgtEnhet } = this.props;
        leggEnhetIUrl(valgtEnhet.enhet!.enhetId);
    }

    componentDidMount() {
        this.props.hentStatusTall(this.props.valgtEnhet.enhet!.enhetId);
        this.props.hentEnhetTiltak(this.props.valgtEnhet.enhet!.enhetId);
    }

    render() {
        const { formatMessage } = this.props.intl;
        const { filtervalg, veilederliste, statustall, enhettiltak, listevisning } = this.props;

        const leggTilNavn = (identer, veiledere) => identer.map((ident) => {
            const veileder = veiledere.find((v) => v.ident === ident);
            return { label: `${veileder.etternavn}, ${veileder.fornavn} (${ident})`, key: ident };
        });

        return (
            <DocumentTitle title={formatMessage({ id: 'lenker.enhet.oversikt' })}>
                <div className="enhet-side blokk-xl">
                    <Lenker />
                    <Innholdslaster avhengigheter={[statustall, enhettiltak]}>
                        <div id="oversikt-sideinnhold" role="tabpanel">
                            <p className="typo-infotekst begrensetbredde blokk-l">
                                <FormattedMessage id="enhet.ingresstekst.enhetoversikt" />
                            </p>
                            <FiltreringContainer
                                filtervalg={filtervalg}
                                enhettiltak={enhettiltak.data.tiltak}
                                filtergruppe="enhet"
                            />
                            <FiltreringLabelContainer
                                filtervalg={{
                                    ...filtervalg,
                                    veiledere: leggTilNavn(filtervalg.veiledere, veilederliste)
                                }}
                                filtergruppe="enhet"
                                enhettiltak={enhettiltak.data.tiltak}
                                listevisning={listevisning}
                            />
                            <ListevisningInfoPanel name={ListevisningType.enhetensOversikt} />
                            <EnhetsportefoljeVisning />
                            <TomPortefoljeModal isOpen={statustall.data.totalt === 0} />
                        </div>
                    </Innholdslaster>
                </div>
            </DocumentTitle>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    valgtEnhet: state.enheter.valgtEnhet,
    filtervalg: state.filtrering,
    veilederliste: state.veiledere.data.veilederListe,
    statustall: state.statustall,
    enhettiltak: state.enhettiltak,
    listevisning: state.ui.listevisningEnhetensOversikt
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
    hentStatusTall: (enhet) => dispatch(hentStatusTall(enhet)),
    hentEnhetTiltak: (enhet) => dispatch(hentEnhetTiltak(enhet))
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(EnhetSide));
