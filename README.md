# Cell Syntax Experiment
This release contains the data used to evaluate cell selection syntax in a controlled experiment with students.

## External Links
- [Hosted Experiment Tool](http://131.188.64.202/)

## Content
- `/data`: Raw (anonymized) source data
- `1_data-integrity-events.ipynb`: Data integrity checks for the raw source data
- `2_preparation.ipynb`: Data preparation, calculation of variables
- `3_data-integrity-variables.ipynb`: Data integrity checks for calculated variables
- `4_analysis.ipynb`: Quantitative data analysis and hypotheses checks

### Experiment
- See [experiment/README.md](./experiment/README.md)

## Setup
- Dependency management using `uv`, to initialize call `uv sync`
- `source .venv/bin/activate`
- Run notebooks with the created Python kerneln (3.11.11)