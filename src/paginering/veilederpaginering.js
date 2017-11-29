import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Paginering from './paginering';
import { settSubListeForPaginering, settListeSomSkalPagineres,
    klarerPagineringsliste } from '../ducks/veilederpaginering';
import { veilederShape } from '../proptype-shapes';
import { DEFAULT_PAGINERING_STORRELSE } from './../konstanter';

class VeilederPaginering extends Component {

    componentWillMount() {
        this.props.opprettPaginering(this.props.liste);
        this.props.settSubListe(this.props.fraIndeksForSubListe, DEFAULT_PAGINERING_STORRELSE);
    }

    componentWillUnmount() {
        this.props.klarerPaginering();
    }

    render() {
        const {
            liste,
            fraIndeksForSubListe,
            sideStorrelse,
            settSubListe,
            pagineringTekstId,
            subListe
        } = this.props;
        const pagineringTekstValues = liste.length > 0 ? {
            fraIndex: `${fraIndeksForSubListe + 1}`,
            tilIndex: fraIndeksForSubListe + subListe.length,
            antallTotalt: liste.length
        } : {
            fraIndex: '0',
            tilIndex: '0',
            antallTotalt: '0'
        };

        const pagineringTekst = (
            <FormattedMessage
                id={pagineringTekstId}
                values={pagineringTekstValues}
            />
        );

        return (
            <div>
                <Paginering
                    antallTotalt={liste.length}
                    fraIndex={fraIndeksForSubListe}
                    hentListe={(fra, til) => { settSubListe(fra, til); }}
                    tekst={pagineringTekst}
                    sideStorrelse={sideStorrelse}
                    antallReturnert={subListe.length}
                />
            </div>
        );
    }
}

VeilederPaginering.propTypes = {
    liste: PT.arrayOf(veilederShape).isRequired,
    pagineringTekstId: PT.string.isRequired,
    fraIndeksForSubListe: PT.number.isRequired,
    sideStorrelse: PT.number.isRequired,
    opprettPaginering: PT.func.isRequired,
    klarerPaginering: PT.func.isRequired,
    settSubListe: PT.func.isRequired,
    subListe: PT.arrayOf(veilederShape).isRequired
};

const mapStateToProps = (state) => ({
    fraIndeksForSubListe: state.veilederpaginering.fraIndeksForSubListe,
    sideStorrelse: state.veilederpaginering.sideStorrelse,
    subListe: state.veilederpaginering.subListe
});

const mapDispatchToProps = (dispatch) => ({
    opprettPaginering: (liste) => dispatch(settListeSomSkalPagineres(liste)),
    klarerPaginering: () => dispatch(klarerPagineringsliste()),
    settSubListe: (fra, til) => dispatch(settSubListeForPaginering(fra, til))
});

export default connect(mapStateToProps, mapDispatchToProps)(VeilederPaginering);

