---
title: "Enhancing Graph Self-Supervised Learning with Graph Interplay"
collection: publications
category: preprint
permalink: /publication/graph_interplay
date: 2024-10-05
paperurl: 'https://arxiv.org/pdf/2410.04061'
codeurl: 'https://github.com/LOGO-CUHKSZ/GIP'
---

Graph self-supervised learning (GSSL) has emerged as a compelling framework for extracting informative representations from graph-structured data without extensive reliance on labeled inputs. In this study, we introduce Graph Interplay (GIP), an innovative and versatile approach that significantly enhances the performance equipped with various existing GSSL methods. To this end, GIP advocates direct graph-level communications by introducing random inter-graph edges within standard batches. Against GIP’s simplicity, we further theoretically show that GIP essentially performs a principled manifold separation via combining intergraph message passing and GSSL, bringing about more structured embedding manifolds and thus benefits a series of downstream tasks. Our empirical study demonstrates that GIP surpasses the performance of prevailing GSSL methods across multiple benchmarks by significant margins, highlighting its potential as a breakthrough approach. Besides, GIP can be readily integrated into a series of GSSL methods and consistently offers additional performance gain. This advancement not only amplifies the capability of GSSL but also potentially sets the stage for a novel graph learning paradigm in a broader sense. GIP is open-sourced at https://github.com/LOGO-CUHKSZ/GIP.

