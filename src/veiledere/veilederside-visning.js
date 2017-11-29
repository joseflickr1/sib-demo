import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import Toolbar from './../components/toolbar/toolbar';
import VeiledereTabell from './veiledere-tabell';
import { portefoljestorrelserShape, veiledereShape } from './../proptype-shapes';
import { pagineringSetup } from '../ducks/paginering';
import { sortBy } from '../ducks/sortering';
import { nameToStateSliceMap } from '../ducks/utils';
import { sorter } from './../utils/sortering';
import { settSide } from '../ducks/ui/side';

function erValgtHvisFiltrering(veiledere) {
    if (veiledere && veiledere.length > 0) {
        return (veileder) => veiledere.includes(veileder.ident);
    }
    return () => true; // Ikke valgt noe filter, så alle skal være med.
}
function medPortefoljestorrelse(portefoljeStorrelse) {
    if (portefoljeStorrelse.status !== 'OK') {
        // Før vi har fått portefoljestorrele har alle 0
        return (veileder) => ({ ...veileder, portefoljestorrelse: 0 });
    }
    const storrelseMap = portefoljeStorrelse.data.facetResults
            .reduce((acc, { value: ident, count }) => ({ ...acc, [ident]: count }), {});

    return (veileder) => ({ ...veileder, portefoljestorrelse: storrelseMap[veileder.ident] || 0 });
}
function propertySort({ property, direction }) {
    return sorter(property, direction);
}

class VeilederesideVisning extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fra: 0,
            antall: props.paginering.sideStorrelse,
            veiledere: []
        };

        this.oppdaterVeilederListe = this.oppdaterVeilederListe.bind(this);
        this.oppdaterPaginering = this.oppdaterPaginering.bind(this);
    }
    componentWillMount() {
        this.props.settSide('enhet');
    }

    componentDidMount() {
        this.oppdaterVeilederListe();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.veiledere !== prevProps.veiledere ||
            this.props.veilederFilter !== prevProps.veilederFilter ||
            this.props.portefoljestorrelser !== prevProps.portefoljestorrelser ||
            this.props.sortering !== prevProps.sortering
        ) {
            this.oppdaterVeilederListe();
        }
    }

    oppdaterPaginering(fra, antall) {
        this.setState({ fra, antall });
        this.props.pagineringSetup({
            side: Math.floor(fra / this.state.antall) + 1,
            antall: this.props.veiledere.data.veilederListe.length,
            sideStorrelse: antall
        });
    }

    oppdaterVeilederListe() {
        const veiledere = this.props.veiledere.data.veilederListe
            .filter(erValgtHvisFiltrering(this.props.veilederFilter))
            .map(medPortefoljestorrelse(this.props.portefoljestorrelser))
            .sort(propertySort(this.props.sortering));

        this.props.pagineringSetup({
            side: 1,
            antall: veiledere.length,
            sideStorrelse: 20
        });
        this.setState({ veiledere });
    }

    render() {
        const limitedVeiledere = this.state.veiledere.slice(this.state.fra, this.state.fra + this.state.antall);

        return (
            <div>
                <Toolbar
                    filtergruppe="veiledere"
                    onPaginering={this.oppdaterPaginering}
                    sokVeilederSkalVises
                />
                <VeiledereTabell
                    veiledere={limitedVeiledere}
                    sorterPaaEtternavn={() => this.props.sortBy('etternavn')}
                    sorterPaaPortefoljestorrelse={() => this.props.sortBy('portefoljestorrelse')}
                />
            </div>
        );
    }
}

VeilederesideVisning.propTypes = {
    pagineringSetup: PT.func.isRequired,
    paginering: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    veilederFilter: PT.array.isRequired, // eslint-disable-line react/forbid-prop-types
    sortBy: PT.func.isRequired,
    settSide: PT.func.isRequired,
    veiledere: PT.shape({
        data: veiledereShape.isRequired
    }).isRequired,
    portefoljestorrelser: PT.shape({
        data: portefoljestorrelserShape.isRequired
    }).isRequired,
    sortering: PT.shape({
        property: PT.string,
        direction: PT.string
    }).isRequired
};

const mapStateToProps = (state) => ({
    veiledere: state.veiledere,
    portefoljestorrelser: state.portefoljestorrelser,
    sortering: state.sortering,
    paginering: state.paginering,
    veilederFilter: state[nameToStateSliceMap.veiledere].veiledere
});

const mapDispatchToProps = (dispatch) => ({
    pagineringSetup: (...args) => dispatch(pagineringSetup(...args)),
    sortBy: (...args) => dispatch(sortBy(...args)),
    settSide: (side) => dispatch(settSide(side))
});

export default connect(mapStateToProps, mapDispatchToProps)(VeilederesideVisning);
